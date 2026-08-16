import { ProductIngredient } from '@/modules/product-ingredient/domain/entities/product-ingredient.domain';
import type { IProductIngredientRepository } from '@/modules/product-ingredient/domain/repositories/product-ingredient.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProductIngredientService {
  constructor(
    @Inject('IProductIngredientRepository')
    private readonly productIngredientRepository: IProductIngredientRepository,
  ) {}

  async create(data: Partial<ProductIngredient>, productId: string, manager?: unknown): Promise<ProductIngredient> {
    return await this.productIngredientRepository.create(
      {
        ...data,
        productId,
      },
      manager,
    );
  }

  async deleteByProductId(productId: string, manager?: unknown): Promise<boolean> {
    return await this.productIngredientRepository.deleteByProductId(productId, manager);
  }

  async findByProductId(productId: string): Promise<ProductIngredient[]> {
    return await this.productIngredientRepository.findByProductId(productId);
  }
}
