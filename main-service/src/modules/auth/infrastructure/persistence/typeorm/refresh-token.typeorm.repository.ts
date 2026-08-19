import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RefreshTokensEntity } from '@/entities';
import { IRefreshTokenRepository } from '@/modules/auth/domain/repositories/refresh-token.repository.interface';
import { RefreshToken } from '@/modules/auth/domain/entities/refresh-token.domain';
import { RefreshTokenMapper } from '@/modules/auth/infrastructure/mappers/refresh-token.mapper';

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshTokensEntity)
    private readonly repo: Repository<RefreshTokensEntity>,
  ) {}

  private getRepo(manager?: unknown): Repository<RefreshTokensEntity> {
    const em = manager as EntityManager | undefined;
    return em ? em.getRepository(RefreshTokensEntity) : this.repo;
  }

  async create(entity: Partial<RefreshToken>, manager?: unknown): Promise<RefreshToken> {
    const repo = this.getRepo(manager);
    const obj = repo.create(entity);
    const saved = await repo.save(obj);
    return RefreshTokenMapper.toDomain(saved)!;
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    const found = await this.repo.findOne({ where: { token } });
    return found ? RefreshTokenMapper.toDomain(found) : null;
  }

  async deleteByToken(token: string, manager?: unknown): Promise<boolean> {
    const repo = this.getRepo(manager);
    const result = await repo.delete({ token });
    return !!(result.affected && result.affected > 0);
  }

  async deleteByUserId(userId: string, manager?: unknown): Promise<boolean> {
    const repo = this.getRepo(manager);
    const result = await repo.delete({ userId });
    return !!(result.affected && result.affected > 0);
  }

  async deleteExpiredTokens(manager?: unknown): Promise<void> {
    const repo = this.getRepo(manager);
    await repo.createQueryBuilder().delete().where('expiresAt < :now', { now: new Date() }).execute();
  }
}
