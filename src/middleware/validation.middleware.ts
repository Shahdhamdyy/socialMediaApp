
import { ZodType, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import { BadRequestException } from "../common/exceptions/application.exception";
type ValidationKey = keyof Request
type ValidationSchema = Partial<Record<ValidationKey, ZodType>>
export const validation = (schema: ValidationSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        console.log(Object.keys(schema));
        let validationError: { key: ValidationKey, issue: ZodError['issues'] }[] = [];
        for (const key of Object.keys(schema) as ValidationKey[]) {
            if (!schema[key]) {
                continue;
            }
            const value = schema[key].safeParse(req[key]);
            if (!value.success) {
                validationError.push({ key, issue: value.error.issues })
            }
        }
        if (validationError.length > 0) {
            throw new BadRequestException("Validation Error", { cause: validationError });

        }

        next();





    }
}
