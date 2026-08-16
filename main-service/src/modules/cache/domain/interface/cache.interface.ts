export interface ICacheService {
  /**
   * Lấy dữ liệu từ Cache và tự động parse JSON
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Lưu dữ liệu vào Cache (hỗ trợ TTL tính bằng giây)
   */
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;

  /**
   * Xóa 1 hoặc nhiều key
   */
  del(key: string | string[]): Promise<number>;

  /**
   * Xóa tất cả các keys khớp với pattern
   */
  delByPattern(pattern: string): void;

  /**
   * Kiểm tra key có tồn tại không
   */
  exists(key: string): Promise<boolean>;

  /**
   * Đặt thời gian hết hạn (TTL) cho 1 key
   */
  expire(key: string, seconds: number): Promise<boolean>;

  /**
   * Xóa toàn bộ dữ liệu trong database hiện tại
   */
  clear?(): Promise<void>;

  /**
   * Lấy dữ liệu từ trường trong Hash
   */
  hget<T>(key: string, field: string): Promise<T | null>;

  /**
   * Lưu dữ liệu vào trường trong Hash
   */
  hset<T>(key: string, field: string, value: T): Promise<void>;

  /**
   * Xóa 1 hoặc nhiều trường trong Hash
   */
  hdel(key: string, field: string | string[]): Promise<number>;
}
