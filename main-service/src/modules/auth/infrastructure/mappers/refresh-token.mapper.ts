import { RefreshTokensEntity } from '#src/entities/refresh-tokens.entity';
import { RefreshToken } from '../../domain/entities/refresh-token.domain';

export class RefreshTokenMapper {
  static toDomain(entity: RefreshTokensEntity): RefreshToken {
    if (!entity) return null as any;
    return {
      id: entity.id,
      token: entity.token,
      userId: entity.userId,
      expiresAt: entity.expiresAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDomainList(entities: RefreshTokensEntity[]): RefreshToken[] {
    return entities.map((entity) => this.toDomain(entity));
  }
}
