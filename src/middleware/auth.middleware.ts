import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../common/security/security";
import { get, createRevokeKey } from "../database/redis.service";
import { UnauthorizedException } from "../common/exceptions/application.exception";

interface AuthRequest extends Request {
    userId?: string;
    token?: string;
}

export const auth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            throw new UnauthorizedException("Unauthorized");
        }

        const [flag, token] = authorization.split(" ");

        if (flag !== "Bearer" || !token) {
            throw new UnauthorizedException("Invalid token");
        }

        const data = decodeToken(token);

        const revoked = await get(
            createRevokeKey({
                userId: data.id,
                token,
            })
        );

        if (revoked) {
            throw new UnauthorizedException("Already logged out");
        }

        req.userId = data.id;
        req.token = token;

        next();
    } catch (err) {
        next(err);
    }
};