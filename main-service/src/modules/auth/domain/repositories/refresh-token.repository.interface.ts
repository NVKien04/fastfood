import { RefreshToken } from '@/modules/auth/domain/entities/refresh-token.domain';

export interface IRefreshTokenRepository {
  create(entity: Partial<RefreshToken>, manager?: unknown): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  deleteByToken(token: string, manager?: unknown): Promise<boolean>;
  deleteByUserId(userId: string, manager?: unknown): Promise<boolean>;
  deleteExpiredTokens(manager?: unknown): Promise<void>;
}
