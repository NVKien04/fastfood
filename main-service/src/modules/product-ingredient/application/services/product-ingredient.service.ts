import { CreateProductIngredientDto } from '#src/modules/product/presentation/dto/create-product.dto';
import type { IProductIngredientRepository } from '../../domain/repositories/product-ingredient.repository.interface';
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
