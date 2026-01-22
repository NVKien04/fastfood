import {
  BadRequestException,
  ConflictException,
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
    @Inject('IUserRepository')
    private readonly repo: IUserRepository,
  ) {}

  async register(userDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const existed = await this.repo.findByEmail(userDto.email);
      if (existed) {
        throw new ConflictException('Email đã tồn tại');
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
        throw new ConflictException('Mã định danh đã tồn tại!');
      }
      throw error;
    }
  }

  async getAllUser(): Promise<UserResponseDto[]> {
    const users = await this.repo.findAll();
    return UserMapper.toResponseList(users);
  }

  async delete(userId: string) {
    return this.repo.softDelete(userId);
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const user = await this.repo.update(userId, updateUserDto);
    if (!user) {
      throw new BadRequestException('Có lỗi');
    }
    return UserMapper.toResponse(user);
  }

  async getById(userId: string): Promise<UserEntity | null> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new NotFoundException('Người dùng không tồn tại');
    }
    return user;
  }

  async getPage(FilterObject: any): Promise<PaginationResponse<any>> {
    // console.log('🚀 ~ UserService ~ getPage ~ FilterObject:', FilterObject);
    return this.repo.GetPage(FilterObject);
  }
}
