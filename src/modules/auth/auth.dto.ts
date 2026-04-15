import { z } from "zod";
import { loginSchema, signupSchema } from "./auth.validation"
// export interface LoginDTO {
//     email: string;
//     password: string;
// }
// export interface SignupDTO extends LoginDTO {
//     name: string;
// }

export type SignupDto = z.infer<typeof signupSchema.body>
export type LoginDto = z.infer<typeof loginSchema.body>