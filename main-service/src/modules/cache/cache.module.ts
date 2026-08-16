import { Global, Module } from '@nestjs/common';
import { REDIS_CLIENT, redisProvider } from '@/modules/cache/infrastructure/redis.provider';
import { RedisCacheService } from '@/modules/cache/infrastructure/ioredis-cache.service';

@Global()
@Module({
  providers: [
    redisProvider,
    RedisCacheService,
    {
      provide: 'ICacheService',
      useExisting: RedisCacheService,
    },
  ],
  exports: [REDIS_CLIENT, RedisCacheService, 'ICacheService'],
})
export class CacheModule {}
