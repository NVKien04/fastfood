import { Global, Module } from '@nestjs/common';
import { REDIS_CLIENT, redisProvider } from '@/modules/redis/redis.provider';
import { RedisService } from '@/modules/redis/redis.service';

@Global()
@Module({
  providers: [redisProvider, RedisService],
  exports: [REDIS_CLIENT, RedisService],
})
export class RedisModule {}
