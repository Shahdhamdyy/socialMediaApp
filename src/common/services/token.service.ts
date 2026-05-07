import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env.service";

interface ITokenPayload extends JwtPayload {
  id: string;
}

export class TokenService {
  constructor() { }

  generateToken(
    user: any
  ): { accessToken: string; refreshToken: string } {
    let signature = undefined;
    let audience = undefined;
    let refreshSignature = undefined;

    switch (user.role) {
      case "0":
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

    const accessToken = jwt.sign({ id: user._id }, signature, {
      audience,
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      refreshSignature,
      {
        expiresIn: "1y",
        audience,
      }
    );

    return { accessToken, refreshToken };
  }

  decodeToken(token: string) {
    const decoded = jwt.decode(token) as JwtPayload | null;

    if (!decoded || typeof decoded.aud !== "string") {
      throw new Error("Invalid token");
    }

    let signature: string;

    switch (decoded.aud) {
      case "Admin":
        signature = env.adminSignature;
        break;

      default:
        signature = env.userSignature;
        break;
    }

    const verified = jwt.verify(
      token,
      signature
    ) as ITokenPayload;

    return {
      id: verified.id,
      aud: verified.aud,
    };
  }

  decodeRefreshToken(
    refreshToken: string
  ): ITokenPayload {
    const decoded = jwt.decode(
      refreshToken
    ) as JwtPayload | null;

    if (!decoded || typeof decoded.aud !== "string") {
      throw new Error("Invalid refresh token");
    }

    let refreshSignature: string;

    switch (decoded.aud) {
      case "Admin":
        refreshSignature = env.adminRefreshSignature;
        break;

      default:
        refreshSignature = env.userRefreshSignature;
        break;
    }

    const decodedData = jwt.verify(
      refreshToken,
      refreshSignature
    ) as ITokenPayload;

    return decodedData;
  }
}