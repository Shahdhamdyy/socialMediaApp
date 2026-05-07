import { IUser } from "../../common/interfaces";
import { DatabaseRrepository } from "../../database/repository/base.repository";
import { Model, HydratedDocument } from "mongoose";
import userModel from "../../database/model/user.model";
import { MulterEnum } from "../../common/enums";
import { s3Service } from "../../common/services/s3.service";
import { ObjectCannedACL } from "@aws-sdk/client-s3";
export class UserSevice {
    private userModel: Model<IUser>;
    private userRepository: DatabaseRrepository<IUser>;

    constructor() {
        this.userModel = userModel;
        this.userRepository = new DatabaseRrepository<IUser>(userModel);
    }

    async getUserProfile(
        userId: string
    ): Promise<HydratedDocument<IUser>> {

        const user = await this.userRepository
            .findById(userId)
            .select("-password");

        if (!user) {
            throw new Error("User not found");
        }

        return user;
    }

    async updateUserProfile(
        userId: string,
        file: Express.Multer.File
    ): Promise<HydratedDocument<IUser>> {

        const user = await this.userRepository
            .findById(userId)
            .select("-password");

        if (!user) {
            throw new Error("User not found");
        }
        if (file) {
            let { key } = await s3Service.uploadBigAsset({
                storageKey: MulterEnum.diskStorage,
                path: `${user._id}/profile-pic`,
                file,
                ACL: ObjectCannedACL.private, // Add the missing ACL property
            })as any
            user.profilePic = key
            await user.save()
            // await user.save()

        }

        return user;
    }
}


export const userService = new UserSevice();