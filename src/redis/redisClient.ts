const IORedis = require( 'ioredis');
import type { Redis } from "ioredis";
const logger = require( '../utils/logger.util');

let redisInstance:Redis|null = null;

function getRedisConnection() {
  if (!redisInstance) {
    redisInstance = new IORedis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT||'6379', 10),
      maxRetriesPerRequest: null,
      retryStrategy: (times:number):number|null => {
        if (times > 10) {
          if (process.env.NODE_ENV !== 'production') {
            console.error("Đã retry quá 10 lần, dừng kết nối.");
          }
          logger.error('Lỗi kết nối Redis: Đã retry quá 10 lần, dừng kết nối.')
          return null; 
        }
        const delay = Math.min(times * 1000, 10000); 
        if (process.env.NODE_ENV !== 'production') {
          console.log(`-------Retry lần ${times}...`);
        }
        logger.error(`-------Retry lần ${times}...`);
        return delay;
      }
    });

    redisInstance!.on('error', (err:Error) => {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Redis connection error:', err);
      }
      logger.error(`Redis connection error: ${err}`);
    });
  }

  return redisInstance;
}

module.exports = getRedisConnection;
