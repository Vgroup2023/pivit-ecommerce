import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redis.on('error', (err) => {
  console.error('Redis Client Error', err);
});

redis.on('connect', () => {
  console.log('✓ Redis connected successfully');
});

export async function initializeRedis() {
  try {
    await redis.connect();
    await redis.ping();
    return true;
  } catch (error) {
    console.error('✗ Redis connection failed:', error);
    return false;
  }
}

export default redis;
