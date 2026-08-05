import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { RoleEnum } from '#src/enums/role.enum';
import { HashUtil } from '#src/utils/hash.util';
import { UserMapper } from './infrastructure/user.mapper';
import { UserResponseDto } from './dto/response-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { buildPaginationResponse, PaginationResponse } from '#src/common/core/pagination';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

import { User } from './domain/user.domain';
import type { IUserRepository } from './domain/user.repository.interface';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly repo: IUserRepository,
  ) {}

  // ==========================================
  // NHÓM 1: CÁC HÀM WRAPPER (ỦY QUYỀN REPOSITORY)
  // ==========================================

  async findById(id: string): Promise<User | null> {
    return this.repo.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findByEmail(email);
  }

  async findOne(condition: Partial<User>): Promise<User | null> {
    return this.repo.findOne(condition);
  }

  async findAll(
    condition?: Partial<User>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<User[]> {
    return this.repo.findAll(condition, order, relations);
  }

  async save(entity: Partial<User>): Promise<User> {
    return this.repo.create(entity);
  }

  async updateRaw(id: string, entity: Partial<User>): Promise<User | null> {
    return this.repo.update(id, entity);
  }

  async softDeleteRaw(id: string): Promise<boolean> {
    return this.repo.softDelete(id);
  }

  async findPaginated(options: any, where?: Record<string, any>): Promise<[User[], number]> {
    return this.repo.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  async register(userDto: CreateUserDto): Promise<UserResponseDto> {
    const existed = await this.findByEmail(userDto.email);
    if (existed) {
      throw new BusinessException(ErrorEnum.USER_EXISTED);
    }
    const hashPassword = await HashUtil.hash(userDto.password);
    const dataToSave: Partial<User> = {
      ...userDto,
      password: hashPassword,
      role: userDto.role || RoleEnum.CUSTOMER,
    };
    const user = await this.save(dataToSave);
    return UserMapper.toResponse(user);
  }

  async getAllUser(): Promise<UserResponseDto[]> {
    const users = await this.findAll();
    return UserMapper.toResponseList(users);
  }

  async delete(userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }
    return this.softDeleteRaw(userId);
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.updateRaw(userId, updateUserDto);
    if (!user) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }
    return UserMapper.toResponse(user);
  }

  async getById(userId: string): Promise<User | null> {
    const user = await this.findById(userId);
    if (!user) {
      throw new BusinessException(ErrorEnum.USER_NOT_FOUND);
    }
    return user;
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    const dataDto = UserMapper.toResponseList(data);

    return buildPaginationResponse(dataDto, totalItems, page, limit);
  }
}
