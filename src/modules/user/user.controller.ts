import { Router } from 'express'
import { userService } from './user.service'
import { Request, Response } from 'express'
import { auth } from '../../middleware/auth.middleware'
import { successResponse } from '../../common/exceptions/success.responce'
import { AuthRequest } from '../../middleware/auth.middleware'
import { uploadFile } from '../../common/utils/multer/cloud'
import { MulterEnum } from '../../common/enums/multer.enums'
const router = Router()
router.get(
    "/get-user-profile",
    auth,
    async (req: AuthRequest, res: Response) => {

        const userData = await userService.getUserProfile(
            req.userId as string
        );

        return successResponse({
            res,
            message: "User profile data fetched successfully 👌",
            status: 200,
            data: userData,
        });
    }
);
router.patch(
    "/update-user-profile",
    auth,
    uploadFile({ storageKey: MulterEnum.diskStorage }).single("file"),
    async (req: AuthRequest, res: Response) => {
        console.log(req.file);

        const userData = await userService.updateUserProfile(
            req.userId as string,
            req.file as Express.Multer.File
        );

        return successResponse({
            res,
            message: "User profile data fetched successfully 👌",
            status: 200,
            data: userData,
        });
    }
);
export default router