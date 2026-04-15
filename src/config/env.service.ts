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
    APP_PASSWORD




}