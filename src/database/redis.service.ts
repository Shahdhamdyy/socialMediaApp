import { client } from "./redis";


export const set = async (key: string,value: string,ttl?: number): Promise<void> => {
  if (ttl) {
    await client.set(key, value, { EX: ttl });
  } else {
    await client.set(key, value);
  }
};


export const get = async (key: string): Promise<string | null> => {
  return await client.get(key);
};

export const del = async (key: string): Promise<number> => {
  return await client.del(key);
};

//(logout)
export const revokeToken = async (key: string,token: string,ttl: number = 60 * 60 * 24 * 7 // 7 days
): Promise<void> => {
  await set(key, token, ttl);
};


export const createRevokeKey = (data: {
  userId: string;
  token: string;
}): string => {
  return `revoke:${data.userId}:${data.token}`;
};