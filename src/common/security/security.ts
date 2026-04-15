import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.service";
import { RoleEnum } from "../enums";

interface IUser {
    _id: string;
    role: RoleEnum;
}

interface ITokenPayload extends JwtPayload {
    id: string;
}

type Audience = "Admin" | "User";


export const generateToken = (user: IUser) => {
    let signature: string;
    let refreshSignature: string;
    let audience: Audience;

    switch (user.role) {
        case RoleEnum.Admin:
            signature = env.adminSignature;
            refreshSignature = env.adminRefreshSignature;
            audience = "Admin";
            break;

        default:
            signature = env.userSignature;
            refreshSignature = env.userRefreshSignature;
            audience = "User";
            break;
    }

    const accessToken = jwt.sign(
        { id: user._id },
        signature,
        {
            audience,
            expiresIn: "30m",
        } as SignOptions
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        refreshSignature,
        {
            audience,
            expiresIn: "1y",
        } as SignOptions
    );

    return { accessToken, refreshToken };
};


export const decodeToken = (token: string): ITokenPayload => {
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || typeof decoded.aud !== "string") {
        throw new Error("Invalid token");
    }

    let signature: string;

    switch (decoded.aud) {
        case "Admin":
            signature = env.adminSignature;
            break;

        case "User":
            signature = env.userSignature;
            break;

        default:
            throw new Error("Invalid audience");
    }

    return jwt.verify(token, signature) as ITokenPayload;
};