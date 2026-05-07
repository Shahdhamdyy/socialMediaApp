import { Request, Response, NextFunction } from "express";
import { TokenService } from "../common/services/token.service";
import { redisService } from "../common/services/redis.service";
import { UnauthorizedException } from "../common/exceptions/application.exception";

export interface AuthRequest extends Request {
    userId?: string;
    token?: string;
}

const tokenService = new TokenService();

export const auth = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authorization = req.headers.authorization?.trim();

 

        if (!authorization) {
            throw new UnauthorizedException("Unauthorized");
        }


        const match = authorization.match(/^Bearer\s+(.+)$/);

        console.log("MATCH:", match);

        if (!match || !match[1]) {
            throw new UnauthorizedException("Invalid token format");
        }

        const token = match[1].trim();

        const data = tokenService.decodeToken(token);

        const revokeKey = redisService.createRevokeKey({
            userId: data.id,
            token,
        });

        const revoked = await redisService.get(revokeKey);

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