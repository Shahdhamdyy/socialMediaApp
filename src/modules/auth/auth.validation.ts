
import { z } from "zod";
export const signupSchema = {
    body: z.strictObject({
        userName: z.string({ error: "name not found" }).min(2, { error: "Name must be at least 2 characters" }).max(10, { error: "Name must be at most 10 characters" }),
        email: z.email({ error: "Invalid email format" }),
        password: z.string().min(6, { error: "Password must be at least 6 characters" }).max(20, { error: "Password must be at most 20 characters" }),
        phone: z.string().min(6, { error: "Phone number must be at least 6 characters" }).max(20, { error: "Phone number must be at most 20 characters" }),
        confirmPassword: z.string().min(6, { error: "Confirm Password must be at least 6 characters" }).max(20, { error: "Confirm Password must be at most 20 characters" })
    }).superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({ code: "custom", error: "password not match " })
        }
    })
}
export const loginSchema = {
    body: z.strictObject({
        email: z.email({ error: "Invalid email format" }),
        password: z.string().min(6, { error: "Password must be at least 6 characters" }).max(20, { error: "Password must be at most 20 characters" }),
    })
}