import { UserResponseDto } from 'src/dtos/user/response-user.dto';
import { UserEntity } from 'src/entities/user.entity';

export class UserMapper {
  static toResponse(entity: UserEntity): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      phone: entity.phone,
      avatar: entity.avatar,
      role: entity.role,
      provider: entity.provider,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  static toResponseList(entities: UserEntity[]): UserResponseDto[] {
    return entities.map(this.toResponse);
  }
}
