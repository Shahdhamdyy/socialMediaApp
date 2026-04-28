import { env } from "../../../config/env.service";
import bcrypt from "bcrypt";
export const generateHash = async ({ plainText, salt = env.salt }: {
    plainText: string,
    salt?: string
}): Promise<string> => {
    return await bcrypt.hash(plainText, Number(salt));
}

export const compareHash = async ({ plainText, cypherText }: {
    plainText: string,
    cypherText: string
}): Promise<boolean> => {
    return await bcrypt.compare(plainText, cypherText);
}