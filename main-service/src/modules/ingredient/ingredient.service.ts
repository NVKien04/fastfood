import { PaginationResponse } from '#src/common/core/paganation';
import { CreateIngredientDto } from '#src/modules/ingredient/dto/create-ingredient.dto';
import { UpdateIngredientDto } from '#src/modules/ingredient/dto/update-ingredient.dto';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import type { IngredientsRepository } from '#src/modules/ingredient/repository/ingredient.repository';

import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class IngredientService {
  constructor(
    @Inject('IIngredientRepository')
    private readonly ingredientRepository: IngredientsRepository,
  ) {}

  async create(data: CreateIngredientDto): Promise<IngredientsEntity> {
    return this.ingredientRepository.create(data);
  }

  async findById(id: number): Promise<IngredientsEntity | null> {
    return this.ingredientRepository.findOne({ id });
  }

  async findByCategoryId(categoryId: number): Promise<IngredientsEntity[]> {
    return this.ingredientRepository.findAll({ categoryId });
  }

  async getPage(FilterObject: any): Promise<PaginationResponse<any>> {
    return this.ingredientRepository.GetPage(FilterObject);
  }

  async update(id: number, data: UpdateIngredientDto): Promise<IngredientsEntity | null> {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      throw new NotFoundException('Nguyên liệu không tồn tại');
    }
    return this.ingredientRepository.update(id, data);
  }

  async delete(id: number) {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      throw new NotFoundException('Nguyên liệu không tồn tại');
    }
    return this.ingredientRepository.softDelete(id);
  }
}
