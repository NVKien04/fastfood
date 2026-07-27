import { PaginationResponse } from '#src/common/core/paganation';
import { Fn } from '#src/utils/fn';
import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';

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
      throw new ConflictException('Danh mục đã tồn tại');
    }

    return await this.repo.create(createCategory);
  }

  async update(updateCategoryDto: UpdateCategoryDto, id: number): Promise<CategoryEntity | null> {
    const category = await this.repo.findById(id);
    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    return this.repo.update(id, updateCategoryDto);
  }

  async delete(categoryId: number) {
    return await this.repo.softDelete(categoryId);
  }
  async getPage(FilterObject: any): Promise<PaginationResponse<any>> {
    return await this.repo.GetPage(FilterObject);
  }

  async geyWidthProduct(id: number): Promise<CategoryEntity | null> {
    return await this.repo.findById(id);
  }

  async getById(categoryId: number): Promise<CategoryEntity | null> {
    return this.repo.findById(categoryId);
  }
}
