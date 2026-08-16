import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@/modules/cache/infrastructure/redis.provider';
import { ICacheService } from '@/modules/cache/domain/interface/cache.interface';

@Injectable()
export class RedisCacheService implements ICacheService, OnModuleDestroy {
  private readonly logger = new Logger(RedisCacheService.name);

  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  onModuleDestroy() {
    if (this.redisClient) {
      this.redisClient.disconnect();
    }
  }

  /**
   * Lấy client ioredis gốc nếu cần thực hiện lệnh trực tiếp
   */
  getClient(): Redis {
    return this.redisClient;
  }

  private parseData<T>(value: T): string {
    return JSON.stringify(value);
  }

  /**
   * Lấy dữ liệu từ Redis và tự động parse JSON
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redisClient.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis GET error [${key}]: ${message}`);
      return null;
    }
  }

  /**
   * Lưu dữ liệu vào Redis (hỗ trợ TTL tính bằng giây)
   */
  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = this.parseData(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.redisClient.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.redisClient.set(key, serialized);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis SET error [${key}]: ${message}`);
    }
  }

  /**
   * Xóa 1 hoặc nhiều key
   */
  async del(key: string | string[]): Promise<number> {
    try {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.length === 0) return 0;
      return await this.redisClient.del(...keys);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const keyStr = Array.isArray(key) ? key.join(', ') : key;
      this.logger.error(`Redis DEL error [${keyStr}]: ${message}`);
      return 0;
    }
  }

  /**
   * Xóa tất cả các keys khớp với pattern sử dụng SCAN stream
   */
  delByPattern(pattern: string): void {
    try {
      const stream = this.redisClient.scanStream({
        match: pattern,
        count: 100,
      });

      stream.on('data', (resultKeys: string[]) => {
        if (resultKeys.length > 0) {
          const pipeline = this.redisClient.pipeline();
          resultKeys.forEach((k) => pipeline.del(k));
          void pipeline.exec();
        }
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis DEL pattern error [${pattern}]: ${message}`);
    }
  }

  /**
   * Kiểm tra key có tồn tại không
   */
  async exists(key: string): Promise<boolean> {
    try {
      const count = await this.redisClient.exists(key);
      return count > 0;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis EXISTS error [${key}]: ${message}`);
      return false;
    }
  }

  /**
   * Đặt thời gian hết hạn (TTL) cho 1 key
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    try {
      const result = await this.redisClient.expire(key, seconds);
      return result === 1;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis EXPIRE error [${key}]: ${message}`);
      return false;
    }
  }

  /**
   * Xóa toàn bộ dữ liệu database Redis hiện tại
   */
  async clear(): Promise<void> {
    try {
      await this.redisClient.flushdb();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis CLEAR error: ${message}`);
    }
  }

  // --- HASH OPERATIONS ---

  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const data = await this.redisClient.hget(key, field);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis HGET error [${key}.${field}]: ${message}`);
      return null;
    }
  }

  async hset<T>(key: string, field: string, value: T): Promise<void> {
    try {
      await this.redisClient.hset(key, field, this.parseData(value));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis HSET error [${key}.${field}]: ${message}`);
    }
  }

  async hdel(key: string, field: string | string[]): Promise<number> {
    try {
      const fields = Array.isArray(field) ? field : [field];
      if (fields.length === 0) return 0;
      return await this.redisClient.hdel(key, ...fields);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const fieldStr = Array.isArray(field) ? field.join(', ') : field;
      this.logger.error(`Redis HDEL error [${key}.${fieldStr}]: ${message}`);
      return 0;
    }
  }
}
