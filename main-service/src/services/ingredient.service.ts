import { PaginationResponse } from '#src/common/core/paganation';
import { CreateIngredientDto } from '#src/dtos/ingredient/create-ingredient.dto';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import type { IngredientsRepository } from '#src/repositories/ingredient/ingredient.repository';

import { Inject, Injectable } from '@nestjs/common';

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
}
