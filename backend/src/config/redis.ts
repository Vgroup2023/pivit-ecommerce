import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

let redis: any = null;

export async function initializeRedis() {
  try {
    // Only attempt Redis connection if explicitly configured
    if (!process.env.REDIS_URL) {
      console.log('⚠️  REDIS_URL not set - skipping Redis (app will use in-memory sessions)');
      return false;
    }

    redis = createClient({
      url: process.env.REDIS_URL,
    });

    redis.on('error', (err: any) => {
      console.error('Redis Client Error', err);
    });

    redis.on('connect', () => {
      console.log('✓ Redis connected successfully');
    });

    await redis.connect();
    await redis.ping();
    console.log('✓ Redis initialized successfully');
    return true;
  } catch (error) {
    console.error('✗ Redis connection failed:', error);
    redis = null;
    return false;
  }
}

export default redis;
