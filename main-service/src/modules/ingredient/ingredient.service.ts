import { buildPaginationResponse, PaginationResponse } from '#src/common/core/paganation';
import { CreateIngredientDto } from '#src/modules/ingredient/dto/create-ingredient.dto';
import { UpdateIngredientDto } from '#src/modules/ingredient/dto/update-ingredient.dto';
import { IngredientsEntity } from '#src/entities/ingredients.entity';
import type { IIngredientRepository } from '#src/modules/ingredient/repository/ingredient.repository.interface';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class IngredientService {
  constructor(
    @Inject('IIngredientRepository')
    private readonly ingredientRepository: IIngredientRepository,
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

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.ingredientRepository.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async update(id: number, data: UpdateIngredientDto): Promise<IngredientsEntity | null> {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      throw new BusinessException(ErrorEnum.INGREDIENT_NOT_FOUND);
    }
    return this.ingredientRepository.update(id, data);
  }

  async delete(id: number) {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      throw new BusinessException(ErrorEnum.INGREDIENT_NOT_FOUND);
    }
    return this.ingredientRepository.softDelete(id);
  }
}
