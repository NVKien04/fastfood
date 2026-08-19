import { UserEntity } from '@/entities';
import { User } from '@/modules/user/domain/entities/user.domain';
import { UserResponseDto } from '@/modules/user/presentation/dto';

export class UserMapper {
  static toDomain(ormEntity: UserEntity): User {
    if (!ormEntity) {
      throw new Error('UserMapper.toDomain requires an entity');
    }

    return new User({
      id: ormEntity.id,
      email: ormEntity.email,
      password: ormEntity.password,
      name: ormEntity.name,
      phone: ormEntity.phone,
      avatar: ormEntity.avatar,
      role: ormEntity.role,
      provider: ormEntity.provider,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
    });
  }

  static toDomainList(ormEntities: UserEntity[]): User[] {
    if (!ormEntities) return [];
    return ormEntities.map((entity) => UserMapper.toDomain(entity));
  }

  static toOrmEntity(domainModel: Partial<User>): Partial<UserEntity> {
    if (!domainModel) return {};

    const entity: Partial<UserEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.email !== undefined) entity.email = domainModel.email;
    if (domainModel.password !== undefined) entity.password = domainModel.password;
    if (domainModel.name !== undefined) entity.name = domainModel.name;
    if (domainModel.phone !== undefined) entity.phone = domainModel.phone;
    if (domainModel.avatar !== undefined) entity.avatar = domainModel.avatar;
    if (domainModel.role !== undefined) entity.role = domainModel.role;
    if (domainModel.provider !== undefined) entity.provider = domainModel.provider;
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;
    if (domainModel.deletedAt !== undefined) entity.deletedAt = domainModel.deletedAt;

    return entity;
  }

  static toResponse(user: User | UserEntity): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      provider: user.provider,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  static toResponseList(users: (User | UserEntity)[]): UserResponseDto[] {
    if (!users) return [];
    return users.map((u) => UserMapper.toResponse(u));
  }
}
