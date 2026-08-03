import { buildPaginationResponse, PaginationResponse } from '#src/common/core/paganation';
import { ErrorEnum } from '#src/common/constants/error-code.constant';
import { BusinessException } from '#src/common/exception/biz.exception';
import { Fn } from '#src/utils/fn';
import { Inject, Injectable } from '@nestjs/common';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from '#src/entities/category.entity';
import type { ICategoryRepository } from '#src/modules/category/repository/category.repository.interface';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly repo: ICategoryRepository,
  ) {}

  async create(createCategory: CreateCategoryDto): Promise<CategoryEntity | null> {
    const slug = Fn.changeNameToSlug(createCategory.name);
    const existed = await this.repo.findOne({ slug: slug });
    if (existed) {
      throw new BusinessException(ErrorEnum.CATEGORY_EXISTED);
    }

    return await this.repo.create(createCategory);
  }

  async update(updateCategoryDto: UpdateCategoryDto, id: number): Promise<CategoryEntity | null> {
    const category = await this.repo.findById(id);
    if (!category) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }
    return this.repo.update(id, updateCategoryDto);
  }

  async delete(categoryId: number) {
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

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async geyWidthProduct(id: number): Promise<CategoryEntity | null> {
    return await this.repo.findById(id);
  }

  async getById(categoryId: number): Promise<CategoryEntity | null> {
    return this.repo.findById(categoryId);
  }
}
