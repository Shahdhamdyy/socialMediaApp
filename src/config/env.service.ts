import { config } from 'dotenv';
import path from 'path';


config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) });
import dotenv from 'dotenv';
dotenv.config({ path: "./config/.env" });

const mongoURL = process.env.MONGO_URI as string;
const mood = process.env.MOOD as string;
const port = process.env.PORT as string;
const salt = process.env.SALT as string;
const jwt_key = process.env.JWT_KEY as string;
const userSignature = process.env.JWT_USER_SIGNATURE as string;
const adminSignature = process.env.JWT_ADMIN_SIGNATURE as string;
const userRefreshSignature = process.env.JWT_USER_REFRESH_SIGNATURE as string;
const adminRefreshSignature = process.env.JWT_ADMIN_REFRESH_SIGNATURE as string;
const BASE_URL = process.env.Base_URL as string;
const REDIS_URI = process.env.REDIS_URI as string;
const APP_EMAIL = process.env.APP_EMAIL as string;
const APP_PASSWORD = process.env.APP_PASSWORD as string;

const AWS_BUCKET_NAME = process.env.const as string

const AWS_REGION = process.env.AWS_REGION as string;

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string

const AWS_EXPIRATION_TIME = process.env.AWS_EXPIRATION_TIME as string
export const env = {
    mongoURL,
    mood,
    port,
    salt,
    jwt_key,
    userSignature,
    adminSignature,
    userRefreshSignature,
    adminRefreshSignature,
    BASE_URL,
    REDIS_URI,
    APP_EMAIL,
    APP_PASSWORD,
    AWS_BUCKET_NAME,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_EXPIRATION_TIME




}