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

  async create(createCategory: CreateCategoryDto): Promise<Category | null> {
    const slug = Fn.changeNameToSlug(createCategory.name);
    const existed = await this.repo.findOne({ slug });
    if (existed) {
      throw new BusinessException(ErrorEnum.CATEGORY_EXISTED);
    }
    const categoryData: Partial<Category> = {
      ...createCategory,
      slug,
      isActive: createCategory.isActive !== undefined ? Boolean(createCategory.isActive) : undefined,
    };

    return await this.repo.create(categoryData);
  }

  async update(updateCategoryDto: UpdateCategoryDto, id: number): Promise<Category | null> {
    const category = await this.repo.findById(id);
    if (!category) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }
    const payload: Partial<Category> = {
      ...updateCategoryDto,
      isActive: updateCategoryDto.isActive !== undefined ? Boolean(updateCategoryDto.isActive) : undefined,
    };

    return this.repo.update(id, payload);
  }

  async delete(categoryId: number): Promise<boolean> {
    const category = await this.repo.findById(categoryId);
    if (!category) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }
    return await this.repo.softDelete(categoryId);
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

    if (totalItems) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async geyWidthProduct(id: number): Promise<Category | null> {
    return await this.repo.findById(id);
  }

  async getById(categoryId: number): Promise<Category | null> {
    return this.repo.findById(categoryId);
  }
}
