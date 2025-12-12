import { BadRequestException, Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { RoleEnum } from 'src/enums/role.enum';
import type { IUserRepository } from 'src/repositories/user/user.repository.interface';

export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly repo: IUserRepository,
  ) {}

  async createUserDemo(userDto: CreateUserDto): Promise<UserEntity> {
    try {
      const dataToSave = {
        ...userDto,
        role: userDto.role || RoleEnum.CUSTOMER,
      };
      return await this.repo.create(dataToSave);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException('Mã định danh đã tồn tại!');
      }
      throw error;
    }
  }
}
