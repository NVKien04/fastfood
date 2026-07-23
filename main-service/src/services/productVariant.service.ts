import { PaginationResponse } from '#src/common/core/paganation';
import { CreateIngredientDto } from '#src/dtos/ingredient/create-ingredient.dto';
import { CreateProductVariantDto } from '#src/dtos/product/create-product.dto';
import type { IProductVariantRepository } from '#src/repositories/productVariant/productVariant.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProductVariantService {
  constructor(
    @Inject('IProductVariantRepository')
    private readonly productVariantRepository: IProductVariantRepository,
  ) {}

  async create(data: CreateProductVariantDto, productId: string, manager?: EntityManager): Promise<any> {
    return await this.productVariantRepository.create({ ...data, productId }, manager);
  }

  async getPage(FilterObject: any): Promise<PaginationResponse<any>> {
    return await this.productVariantRepository.GetPage(FilterObject);
  }
}
