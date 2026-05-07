import { S3Client } from "@aws-sdk/client-s3";
import { env } from "../../config/env.service";
import { ObjectCannedACL } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { MulterEnum } from "../../common/enums";
import { createReadStream } from "fs";
import { Upload } from "@aws-sdk/lib-storage";
import { CompleteMultipartUploadCommandOutput } from "@aws-sdk/client-s3";
export class S3Service {
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: env.AWS_REGION,
            credentials: {
                accessKeyId: env.AWS_ACCESS_KEY_ID,
                secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
            },
        });
    }


    async uploadAsset({
        storageKey = MulterEnum.diskStorage,
        Bucket = env.AWS_BUCKET_NAME,
        path = "general",
        file,
        ACL = ObjectCannedACL.private,
        contentType,
    }: {
        storageKey?: MulterEnum;
        Bucket?: string;
        path?: string;
        file: Express.Multer.File;
        ACL: ObjectCannedACL;
        contentType?: string;
    }) {
        const key = `socialMedia/${path}/${Math.round(Math.random() * 1e9)}-${file.originalname}`;

        const result = await this.client.send(
            new PutObjectCommand({
                Bucket,
                Key: key,
                ACL,
                Body: storageKey == MulterEnum.memoryStorage ? file.buffer : createReadStream(file.path),
                ContentType: contentType || file.mimetype,
            })
        );

        return key;
    }
    async uploadBigAsset({
        storageKey = MulterEnum.diskStorage,
        Bucket = env.AWS_BUCKET_NAME,
        path = "general",
        file,
        ACL = ObjectCannedACL.private,
        contentType,
        partSize = 4
    }: {
        storageKey?: MulterEnum;
        Bucket?: string;
        path?: string;
        file: Express.Multer.File;
        ACL: ObjectCannedACL;
        contentType?: string;
        partSize?: number
    }): Promise<CompleteMultipartUploadCommandOutput> {
        const key = `socialMedia/${path}/${Math.round(Math.random() * 1e9)}-${file.originalname}`;

        const result = await new Upload({
            client: this.client,
            params: {
                Bucket,
                Key: key,
                ACL,
                Body: storageKey == MulterEnum.memoryStorage ? file.buffer : createReadStream(file.path),
                ContentType: contentType || file.mimetype,
            },
            partSize: partSize * 1024 * 1024

        });
        result.on("httpUploadProgress", (progress) => {
            console.log(progress.loaded);
            console.log(`${progress.loaded as number / (progress.total as number) * 100}%`);
        });

        return await result.done();



    }

}
export const s3Service = new S3Service();
