import type { IProductIngredientRepository } from '../../domain/repositories/product-ingredient.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ProductIngredientsEntity } from '#src/entities/product_ingredients.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class ProductIngredientService {
  constructor(
    @Inject('IProductIngredientRepository')
    private readonly productIngredientRepository: IProductIngredientRepository,
  ) {}

  async create(
    data: Record<string, unknown>,
    productId: string,
    manager?: unknown,
  ): Promise<ProductIngredientsEntity> {
    return await this.productIngredientRepository.create(
      {
        ...data,
        productId,
      },
      manager,
    );
  }

  async deleteByProductId(productId: string, manager?: unknown): Promise<DeleteResult> {
    return await this.productIngredientRepository.deleteByProductId(productId, manager);
  }

  async findByProductId(productId: string): Promise<ProductIngredientsEntity[]> {
    return await this.productIngredientRepository.findByProductId(productId);
  }
}
