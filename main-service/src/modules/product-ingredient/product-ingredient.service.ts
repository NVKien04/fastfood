import { CreateProductIngredientDto } from '#src/modules/product/dto/create-product.dto';
import type { IProductIngredientRepository } from '#src/modules/product-ingredient/repository/product-ingredient.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProductIngredientService {
  constructor(
    @Inject('IProductIngredientRepository')
    private readonly productIngredientRepository: IProductIngredientRepository,
  ) {}

  async create(data: CreateProductIngredientDto, productId: string, manager?: unknown): Promise<any> {
    return await this.productIngredientRepository.create(
      {
        ...data,
        productId,
      },
      manager,
    );
  }
}
