import { BadRequestException, Inject } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { RoleEnum } from 'src/enums/role.enum';
import type { IUserRepository } from 'src/repositories/user/user.repository.interface';
import * as bcrypt from 'bcrypt';

export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly repo: IUserRepository,
  ) {}

  async register(userDto: CreateUserDto): Promise<UserEntity> {
    try {
      const existed = await this.repo.findByEmail(userDto.email);
      if (existed) {
        throw new BadRequestException('Email đã tồn tại');
      }
      const hashPassword = bcrypt.hashSync(userDto.password, 10);
      const dataToSave = {
        ...userDto,
        password: hashPassword,
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

  async getAllUser(): Promise<UserEntity[]> {
    return await this.repo.findAll();
  }
}
