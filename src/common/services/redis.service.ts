import { createClient, RedisClientType } from "redis";
import { env } from "../../config/env.service";
import { Types } from "mongoose"
import { NotFoundException } from "../../common/exceptions/application.exception";
export class RedisService {
    private client: RedisClientType;

    constructor() {
        this.client = createClient({ url: env.REDIS_URI, })
        this.handleConnection();
    }
    handleConnection() {
        this.client.on('error', () => {
            return console.log('redis connection error');
        })
        this.client.on('ready', () => {
            return console.log('redis connected');
        })
    }

    async connect(): Promise<void> {
        try {
            await this.client.connect();
            console.log("Connected to Redis");
        } catch (err) {
            console.error("Failed to connect to Redis:", err);
        }
    }

    getClient(): RedisClientType {
        return this.client;
    }


    createRevokeKey({
        userId,
        token,
    }: {
        userId: Types.ObjectId | string;
        token: string;
    }): string {
        return `revokeToken::${userId}::${token}`;
    }

    set = async ({ key, value, ttl }: {
        key: string,
        value: any,
        ttl: number
    }): Promise<string | null> => {
        if (typeof value == "object") {
            value = JSON.stringify(value);
        }
        return ttl ? await this.client.set(key, value, { EX: ttl, }) : await this.client.set(key, value);
    }



    get = async (key: string): Promise<string | null> => {
        let data = await this.client.get(key)
        if (!data) {
            throw new NotFoundException("Invalid token")
        }
        try {
            data = JSON.parse(data)
        } catch (error) { }
        return data
    };
    ttl = async (key: string): Promise<number | null> => {
        return await this.client.ttl(key)
    }
    exists = async (key: string): Promise<number> => {
        return await this.client.exists(key);
    };

    del = async (key: string): Promise<number> => {
        return await this.client.del(key);
    };
    mget = async (...keys: string[]): Promise<(string | null)[]> => {
        return await this.client.mGet(keys);
    };
    keys = async (pattern: string): Promise<string[]> => {
        return await this.client.keys(pattern);
    };

    //(logout)
    revokeToken = async (key: string, token: string, ttl: number = 60 * 60 * 24 * 7 // 7 days
    ): Promise<void> => {
        await this.set({ key, value: token, ttl });
    };



}
export const redisService = new RedisService();