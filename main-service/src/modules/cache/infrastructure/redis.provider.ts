import { Logger, Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const redisProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('RedisProvider');
    const host = configService.get<string>('REDIS_HOST') || 'localhost';
    const port = parseInt(configService.get<string>('REDIS_PORT') || '6379', 10);
    const password = configService.get<string>('REDIS_PASSWORD') || undefined;

    const client = new Redis({
      host,
      port,
      password,
      lazyConnect: true,
      maxRetriesPerRequest: 3,
    });

    client.on('connect', () => {
      logger.log(`Connected to Redis successfully (${host}:${port})`);
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
