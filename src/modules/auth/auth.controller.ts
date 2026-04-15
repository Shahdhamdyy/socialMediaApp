import { Router, Request, Response, NextFunction } from "express";
import AuthService from "./auth.service";
import { successResponse } from "../../common/exceptions/success.responce";
import { validation } from "../../middleware/validation.middleware";
import { signupSchema, loginSchema } from "./auth.validation";

const router = Router();
router.post(
    "/login",
    validation(loginSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await AuthService.login(req.body);
            return successResponse({ res, message: "Login successful", status: 200, data });
        } catch (err) {
            next(err);
        }
    }
);


router.post(
    "/signup",
    validation(signupSchema),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = await AuthService.signup(req.body);
            return successResponse({ res, message: "Signup successful", status: 201, data, });
        } catch (err) {
            next(err);
        }
    }
);

export default router;