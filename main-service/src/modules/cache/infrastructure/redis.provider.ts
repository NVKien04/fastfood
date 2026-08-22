import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis, { RedisOptions } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('RedisProvider');
    const redisUrl = configService.get<string>('REDIS_URL');

    // 1. Kết nối qua REDIS_URL (Ví dụ từ Upstash rediss://default:xxx@xxx.upstash.io:6379)
    if (redisUrl && redisUrl !== 'REDIS_URL') {
      const client = new Redis(redisUrl, {
        lazyConnect: true,
        maxRetriesPerRequest: 3,
      });

      client.on('connect', () => {
        logger.log('Connected to Redis via REDIS_URL successfully');
      });

      client.on('error', (err: Error) => {
        logger.error(`Redis connection error: ${err.message}`);
      });

      client.connect().catch((err: Error) => {
        logger.error(`Failed to initiate Redis connection: ${err.message}`);
      });

      return client;
    }

    // 2. Kết nối qua các biến rời rạc
    const host = configService.get<string>('REDIS_HOST') || 'localhost';
    const port = parseInt(configService.get<string>('REDIS_PORT') || '6379', 10);
    const password = configService.get<string>('REDIS_PASSWORD') || undefined;
    const isTls = configService.get<string>('REDIS_TLS') === 'true' || host.includes('upstash.io');

    const options: RedisOptions = {
      host,
      port,
      password,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
      ...(isTls ? { tls: {} } : {}),
    };

    const client = new Redis(options);

    client.on('connect', () => {
      logger.log(`Connected to Redis successfully (${host}:${port}${isTls ? ' [TLS]' : ''})`);
    });

    client.on('error', (err: Error) => {
      logger.error(`Redis connection error (${host}:${port}): ${err.message}`);
    });

    client.connect().catch((err: Error) => {
      logger.error(`Failed to initiate Redis connection: ${err.message}`);
    });

    return client;
  },
  inject: [ConfigService],
};
