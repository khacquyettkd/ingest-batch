const getRedisConnection = require( '../redis/redisClient');
const redis = getRedisConnection(); 

async function pushToStream(event: any) {
  await redis.xadd(
    "solar_stream", 
    "MAXLEN", "~", "100000",
    "*",           
    ...event
  );
}

module.exports = pushToStream;
