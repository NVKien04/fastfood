import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { asapScheduler } from 'rxjs';
import { CreateCategoryDto } from 'src/dtos/category/create-category.dto';
import { UpdateCategoryDto } from 'src/dtos/category/update-category.dto';
import { CategoryEntity } from 'src/entities/category.entity';
import type { ICategoryRepository } from 'src/repositories/category/category.repository.interface';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly repo: ICategoryRepository,
  ) {}

  async create(
    createCategory: CreateCategoryDto,
  ): Promise<CategoryEntity | null> {
    return await this.repo.create(createCategory);
  }

  async update(
    updateCategoryDto: UpdateCategoryDto,
    id: string,
  ): Promise<CategoryEntity | null> {
    const category = this.repo.findById(id);
    if (!category) {
      throw new NotFoundException('Email đã tồn tại');
    }
    return this.repo.update(id, updateCategoryDto);
  }

  // async delete(categoryId: string) {
  //   const category = this.repo.findById(categoryId);
  //   if (!category) {
  //     throw new BadRequestException('Email đã tồn tại');
  //   }
  //   return
  // }
}
