import { env } from "../../../config/env.service";
import bcrypt from "bcrypt";
export const generateHash = async ({
    plainText,
}: {
    plainText: string;
}): Promise<string> => {
    return await bcrypt.hash(plainText, 10);
};

export const compareHash = async ({ plainText, cypherText }: {
    plainText: string,
    cypherText: string
}): Promise<boolean> => {
    return await bcrypt.compare(plainText, cypherText);
}