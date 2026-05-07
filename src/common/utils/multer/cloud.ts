import multer from "multer";
import os from "os";
import { MulterEnum } from "../../enums";
export const uploadFile = ({
    storageKey = MulterEnum.memoryStorage
}:
    { storageKey?: MulterEnum }) => {
    // const storage: multer.StorageEngine = multer.memoryStorage();
    const storage = storageKey == MulterEnum.memoryStorage ? multer.memoryStorage() : multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, os.tmpdir())
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + file.originalname
            cb(null, `${file.fieldname}-${uniqueSuffix}`)
        }
    })
    return multer({ storage });

}