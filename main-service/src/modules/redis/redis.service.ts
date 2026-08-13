import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '@/modules/redis/redis.provider';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

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

  /**
   * Lấy dữ liệu từ Redis và tự động parse JSON
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.redisClient.get(key);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error(`Redis GET error [${key}]: ${error.message}`);
      return null;
    }
  }

  /**
   * Lưu dữ liệu vào Redis (hỗ trợ TTL tính bằng giây)
   */
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      if (ttlSeconds && ttlSeconds > 0) {
        await this.redisClient.set(key, serialized, 'EX', ttlSeconds);
      } else {
        await this.redisClient.set(key, serialized);
      }
    } catch (error) {
      this.logger.error(`Redis SET error [${key}]: ${error.message}`);
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
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      this.logger.error(`Redis DEL error [${key}]: ${error.message}`);
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
          pipeline.exec();
        }
      });
    } catch (error) {
      this.logger.error(`Redis DEL pattern error [${pattern}]: ${error.message}`);
    }
  }

  /**
   * Kiểm tra key có tồn tại không
   */
  async exists(key: string): Promise<boolean> {
    try {
      const count = await this.redisClient.exists(key);
      return count > 0;
    } catch (error) {
      this.logger.error(`Redis EXISTS error [${key}]: ${error.message}`);
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
    } catch (error) {
      this.logger.error(`Redis EXPIRE error [${key}]: ${error.message}`);
      return false;
    }
  }

  // --- HASH OPERATIONS ---

  async hget<T>(key: string, field: string): Promise<T | null> {
    try {
      const data = await this.redisClient.hget(key, field);
      if (!data) return null;
      return JSON.parse(data) as T;
    } catch (error) {
      this.logger.error(`Redis HGET error [${key}.${field}]: ${error.message}`);
      return null;
    }
  }

  async hset(key: string, field: string, value: any): Promise<void> {
    try {
      await this.redisClient.hset(key, field, JSON.stringify(value));
    } catch (error) {
      this.logger.error(`Redis HSET error [${key}.${field}]: ${error.message}`);
    }
  }

  async hdel(key: string, field: string | string[]): Promise<number> {
    try {
      const fields = Array.isArray(field) ? field : [field];
      if (fields.length === 0) return 0;
      return await this.redisClient.hdel(key, ...fields);
    } catch (error) {
      this.logger.error(`Redis HDEL error [${key}]: ${error.message}`);
      return 0;
    }
  }
}
