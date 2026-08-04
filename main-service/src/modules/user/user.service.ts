import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from '#src/entities/user.entity';
import { RoleEnum } from '#src/enums/role.enum';
import type { IUserRepository } from '#src/modules/user/repository/user.repository.interface';
import { HashUtil } from '#src/utils/hash.util';
import { UserMapper } from '#src/modules/user/user.mapper';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { buildPaginationResponse, PaginationResponse } from '#src/common/core/pagination';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly repo: IUserRepository,
  ) {}

  async register(userDto: CreateUserDto): Promise<UserResponseDto> {
    const existed = await this.repo.findByEmail(userDto.email);
    if (existed) {
      throw new BusinessException(ErrorEnum.USER_EXISTED);
    }
    const hashPassword = await HashUtil.hash(userDto.password);
    const dataToSave = {
      ...userDto,
      password: hashPassword,
      role: userDto.role || RoleEnum.CUSTOMER,
    };
    const user = await this.repo.create(dataToSave);
    return UserMapper.toResponse(user);
  }

  async getAllUser(): Promise<UserResponseDto[]> {
    const users = await this.repo.findAll();
    return UserMapper.toResponseList(users);
  }

  async delete(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }
    return this.repo.softDelete(userId);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.repo.update(userId, updateUserDto);
    if (!user) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }
    return UserMapper.toResponse(user);
  }

  async getById(userId: string): Promise<UserEntity | null> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }
    return user;
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.repo.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    const dataDto = plainToInstance(UserResponseDto, data, { excludeExtraneousValues: false });

    return buildPaginationResponse(dataDto, totalItems, page, limit);
  }
}
