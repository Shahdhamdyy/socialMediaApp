 import { createClient, RedisClientType } from "redis";
import { env } from "../config/env.service";

export const client: RedisClientType = createClient({
  url: env.REDIS_URI,
});

client.on("error", (err: Error) => {
  console.error("Redis Error:", err);
});

export const connectRedis = async (): Promise<void> => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
  }
};