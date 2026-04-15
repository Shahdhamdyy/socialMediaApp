import { GenderEnum, ProviderEnum, RoleEnum } from "../enums";
export interface IUser {
    _id: string;

    userName: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profilePic?: string
    profileCoverPic?: string[];
    password: string;
    gender?: GenderEnum;
    role: RoleEnum;
    provider: ProviderEnum;
    confirmEmail: boolean;
    createdAt?: Date;
    updatedAt?: Date;


}