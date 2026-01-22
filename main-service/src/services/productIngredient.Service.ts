import { CreateProductIngredientDto } from '#src/dtos/product/create-product.dto';
import type { IProductIngredientRepository } from '#src/repositories/productIngredient/productIngredient.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProductIngredientService {
  constructor(
    @Inject('IProductIngredientRepository')
    private readonly productIngredientRepository: IProductIngredientRepository,
  ) {}

  async create(
    data: CreateProductIngredientDto,
    productId: string,
    manager?: EntityManager,
  ): Promise<any> {
    return await this.productIngredientRepository.create(
      {
        ...data,
        productId,
      },
      manager,
    );
  }
}
