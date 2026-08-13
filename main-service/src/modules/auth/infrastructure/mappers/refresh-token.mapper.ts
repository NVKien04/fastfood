import { RefreshTokensEntity } from '#src/entities/refresh-tokens.entity';
import { RefreshToken } from '../../domain/entities/refresh-token.domain';
import { RefreshTokenResponseDto } from '../../presentation/dto/refresh-token-response.dto';

export class RefreshTokenMapper {
  static toDomain(entity: RefreshTokensEntity): RefreshToken | null {
    if (!entity) return null;
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
    if (!entities) return [];
    return entities.map((entity) => this.toDomain(entity)).filter((item): item is RefreshToken => item !== null);
  }

  static toOrmEntity(domainModel: Partial<RefreshToken>): Partial<RefreshTokensEntity> {
    if (!domainModel) return {};

    const entity: Partial<RefreshTokensEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.token !== undefined) entity.token = domainModel.token;
    if (domainModel.userId !== undefined) entity.userId = domainModel.userId;
    if (domainModel.expiresAt !== undefined) entity.expiresAt = domainModel.expiresAt;
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;

    return entity;
  }

  static toResponse(domain: RefreshToken): RefreshTokenResponseDto {
    return {
      id: domain.id!,
      token: domain.token,
      userId: domain.userId,
      expiresAt: domain.expiresAt,
      createdAt: domain.createdAt!,
      updatedAt: domain.updatedAt!,
    };
  }

  static toResponseList(domains: RefreshToken[]): RefreshTokenResponseDto[] {
    if (!domains) return [];
    return domains.map((domain) => this.toResponse(domain));
  }
}
