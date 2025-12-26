import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UserEntity } from 'src/entities/user.entity';
import { RoleEnum } from 'src/enums/role.enum';
import type { IUserRepository } from 'src/repositories/user/user.repository.interface';
import * as bcrypt from 'bcrypt';
import { UserMapper } from 'src/mappers/user.mapper';
import { UserResponseDto } from 'src/dtos/user/response-user.dto';
import { UpdateUserDto } from 'src/dtos/user/update-user.dto';
import { PaginationResponse } from 'src/common/core/paganation';

@Injectable()
export class UserService {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly repo: IUserRepository,
  ) {}

  async register(userDto: CreateUserDto): Promise<UserResponseDto> {
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
      const user = await this.repo.create(dataToSave);
      console.log(user);
      return UserMapper.toResponse(user);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestException('Mã định danh đã tồn tại!');
      }
      throw error;
    }
  }

  async getAllUser(): Promise<UserResponseDto[]> {
    const users = await this.repo.findAll();
    return UserMapper.toResponseList(users);
  }

  async delete(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản');
    }
    return this.repo.softDelete(userId);
  }

  async update(
    updateUserDto: UpdateUserDto,
    userId: string,
  ): Promise<UserResponseDto> {
    const user = await this.repo.update(userId, updateUserDto);
    if (!user) {
      throw new BadRequestException('Có lỗi');
    }
    return UserMapper.toResponse(user);
  }

  async getPage(FilterObject: any): Promise<PaginationResponse<any>> {
    return this.repo.GetPage(FilterObject);
  }
}
