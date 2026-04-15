import { LoginDto, SignupDto } from "./auth.dto";
import { BadRequestException } from "../../common/exceptions/application.exception";
import { IUser } from "../../common/interfaces";
import { HydratedDocument, Model } from "mongoose";
import userModel from "../../database/model/user.model";
import { DatabaseRrepository } from "../../database/repository/base.repository";
import { generateToken } from "../../common/security/security";
import bcrypt from "bcrypt";
import { AuthResponse } from "../../common/interfaces/authResponse.interface";

class AuthService {
    private userModel: Model<IUser>;
    private userRepository: DatabaseRrepository<IUser>; //act as a layer of abstraction between the service and the database model, allowing for easier testing and separation of concerns to not write mongodb queries directly in the service

    constructor() {
        //will take the user model and create a new instance of the database repository with it, allowing us to use the repository methods to interact with the database in our service methods without directly coupling our service to the database implementation. This promotes better code organization and maintainability.
        this.userModel = userModel;
        this.userRepository = new DatabaseRrepository(this.userModel);
    }


    async login(data: LoginDto): Promise<AuthResponse> {
        const user = await this.userRepository.findOne({ email: data.email }, {});

        if (!user) {
            throw new BadRequestException("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(
            data.password,
            user.password as string
        );

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
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const result: HydratedDocument<IUser> =
            await this.userRepository.create({
                ...data,
                password: hashedPassword,
            });

        if (!result) {
            throw new BadRequestException("Signup failed");
        }

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
}

export default new AuthService();