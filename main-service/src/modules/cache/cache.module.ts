import { Global, Module } from '@nestjs/common';
import { REDIS_CLIENT, redisProvider } from '@/modules/cache/infrastructure/redis.provider';
import { RedisCacheService } from '@/modules/cache/infrastructure/ioredis-cache.service';
import { CACHE_SERVICE } from '@/modules/cache/domain/interface/cache.interface';

@Global()
@Module({
  providers: [
    redisProvider,
    RedisCacheService,
    {
      provide: CACHE_SERVICE,
      useExisting: RedisCacheService,
    },
  ],
  exports: [REDIS_CLIENT, RedisCacheService, CACHE_SERVICE],
})
export class CacheModule {}
