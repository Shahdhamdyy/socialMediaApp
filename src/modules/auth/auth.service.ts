import { LoginDto, SignupDto } from "./auth.dto";
import { BadRequestException, NotFoundException } from "../../common/exceptions/application.exception";
import { IUser } from "../../common/interfaces";
import { HydratedDocument, Model } from "mongoose";
import userModel from "../../database/model/user.model";
import { DatabaseRrepository } from "../../database/repository/base.repository";
import { generateToken } from "../../common/security/security";
import { AuthResponse } from "../../common/interfaces/authResponse.interface";
import { generateHash } from "../../common/utils/security/index";
import { compareHash } from "../../common/utils/security/index";
import { sendEmail } from "../../common/utils/email/sendEmail";
import { redisService, RedisService } from "../../common/services/redis.service";
class AuthService {
    private userModel: Model<IUser>;
    private userRepository: DatabaseRrepository<IUser>; //act as a layer of abstraction between the service and the database model, allowing for easier testing and separation of concerns to not write mongodb queries directly in the service
    private redisService: RedisService

    constructor() {
        //will take the user model and create a new instance of the database repository with it, allowing us to use the repository methods to interact with the database in our service methods without directly coupling our service to the database implementation. This promotes better code organization and maintainability.
        this.userModel = userModel;
        this.userRepository = new DatabaseRrepository(this.userModel);
        this.redisService = redisService
    }


    async login(data: LoginDto): Promise<AuthResponse> {
        const user = await this.userRepository.findOne({ email: data.email }, {});

        if (!user) {
            throw new NotFoundException("Invalid email or password");
        }

        const isMatch = await compareHash({
            plainText: data.password,
            cypherText: user.password as string,
        });

        if (!isMatch) {
            throw new BadRequestException("Invalid email or password");
        }

        const tokens = generateToken({
            _id: user._id.toString(),
            role: user.role,
        });

        return {
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            },
            tokens,
        };
    }



    async signup(data: SignupDto): Promise<AuthResponse> {
        const hashedPassword = await generateHash({
            plainText: data.password,
        });

        const result: HydratedDocument<IUser> =
            await this.userRepository.create({
                ...data,
                password: hashedPassword,
            });

        if (!result) {
            throw new BadRequestException("Signup failed");
        }
        let code = Math.floor(Math.random() * 10000)
        let hashOtp = await generateHash({ plainText: String(code) })
        await this.redisService.set(
            {
                key: `otp::${result._id}`,
                value: hashOtp,
                ttl: 5 * 60
            }
        )
        await sendEmail({
            to: result.email,
            subject: "Welcome to our app ",
            html: `
            <h2>Welcome ${result.firstName || ""} 👋</h2>
            <p>Verification code: ${code}</p>
            <p>Your account has been created successfully.</p>
        `,
        });
        const tokens = generateToken({
            _id: result._id.toString(),
            role: result.role,
        });

        return {
            user: {
                id: result._id.toString(),
                email: result.email,
                role: result.role,
            },
            tokens,
        };
    }


    async verifyEmail({ code, email }: {
        code: string;
        email: string;
    }) {

        let user = await this.userRepository.findOne({ email })
        if (user?.confirmEmail) {
            return { message: "Email already verified !!" }
        }
        if (!user) {
            throw new NotFoundException("User not found")
        }
        const userId = user._id;
        let redisCode = await this.redisService.get(`otp::${userId}`)
        if (!redisCode) {
            throw new BadRequestException("Invalid code or code expired")
        }
        console.log("code:", code, typeof code);
        console.log("redisCode:", redisCode, typeof redisCode);
        if (await compareHash({ plainText: String(code), cypherText: String(redisCode) })) {


            user = await this.userRepository.findOneAndUpdate({ _id: userId }, { confirmEmail: true }, { new: true })

            this.redisService.del(`otp::${userId}`)
        } else {
            throw new BadRequestException("code not matched :(")
        }
        return user
    }
}
export default new AuthService();