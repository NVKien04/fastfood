import { buildPaginationResponse, PaginationResponse } from '#src/common/core/pagination';
import { ErrorEnum } from '#src/common/constants/error-code.constant';
import { BusinessException } from '#src/common/exception/biz.exception';
import { Fn } from '#src/utils/fn';
import { Inject, Injectable } from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './domain/category.domain';
import type { ICategoryRepository } from './domain/category.repository.interface';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly repo: ICategoryRepository,
  ) {}

  // ==========================================
  // NHÓM 1: CÁC HÀM WRAPPER (ỦY QUYỀN REPOSITORY)
  // ==========================================

  async findById(id: number): Promise<Category | null> {
    return this.repo.findById(id);
  }

  async findOne(condition: Partial<Category>): Promise<Category | null> {
    return this.repo.findOne(condition);
  }

  async findAll(
    condition?: Partial<Category>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Category[]> {
    return this.repo.findAll(condition, order, relations);
  }

  async save(entity: Partial<Category>): Promise<Category> {
    return this.repo.create(entity);
  }

  async updateRaw(id: number, entity: Partial<Category>): Promise<Category | null> {
    return this.repo.update(id, entity);
  }

  async softDeleteRaw(id: number): Promise<boolean> {
    return this.repo.softDelete(id);
  }

  async findPaginated(options: any, where?: Record<string, any>): Promise<[Category[], number]> {
    return this.repo.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  async create(createCategory: CreateCategoryDto): Promise<Category | null> {
    const slug = Fn.changeNameToSlug(createCategory.name);
    const existed = await this.findOne({ slug });
    if (existed) {
      throw new BusinessException(ErrorEnum.CATEGORY_EXISTED);
    }
    const categoryData: Partial<Category> = {
      ...createCategory,
      slug,
      isActive: createCategory.isActive !== undefined ? Boolean(createCategory.isActive) : undefined,
    };

    return await this.save(categoryData);
  }

  async update(updateCategoryDto: UpdateCategoryDto, id: number): Promise<Category | null> {
    const category = await this.findById(id);
    if (!category) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }
    const payload: Partial<Category> = {
      ...updateCategoryDto,
      isActive: updateCategoryDto.isActive !== undefined ? Boolean(updateCategoryDto.isActive) : undefined,
    };

    return this.updateRaw(id, payload);
  }

  async delete(categoryId: number): Promise<boolean> {
    const category = await this.findById(categoryId);
    if (!category) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }
    return await this.softDeleteRaw(categoryId);
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

    if (totalItems) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async geyWidthProduct(id: number): Promise<Category | null> {
    return await this.findById(id);
  }

  async getById(categoryId: number): Promise<Category | null> {
    return this.findById(categoryId);
  }
}
