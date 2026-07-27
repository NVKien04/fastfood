import { PaginationResponse } from '#src/common/core/paganation';
import { CreateIngredientDto } from '#src/modules/ingredient/dto/create-ingredient.dto';
import { CreateProductVariantDto } from '#src/modules/product/dto/create-product.dto';
import type { IProductVariantRepository } from '#src/modules/product-variant/repository/product-variant.repository.interface';
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
