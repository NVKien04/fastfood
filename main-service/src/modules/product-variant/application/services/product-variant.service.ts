import { buildPaginationResponse, PaginationResponse } from '@/common/core/pagination';
import { CreateProductVariantDto } from '@/modules/product/presentation/dto/create-product.dto';
import type { IProductVariantRepository } from '@/modules/product-variant/domain/repositories/product-variant.repository.interface';
import { Inject, Injectable } from '@nestjs/common';
import { ProductVariantsEntity } from '@/entities/product_variants.entity';
import { DeleteResult } from 'typeorm';

@Injectable()
export class ProductVariantService {
  constructor(
    @Inject('IProductVariantRepository')
    private readonly productVariantRepository: IProductVariantRepository,
  ) {}

  async create(data: CreateProductVariantDto, productId: string, manager?: unknown): Promise<ProductVariantsEntity> {
    return await this.productVariantRepository.create({ ...data, productId }, manager);
  }

  async deleteByProductId(productId: string, manager?: unknown): Promise<DeleteResult> {
    return await this.productVariantRepository.deleteByProductId(productId, manager);
  }

  async findByProductId(productId: string): Promise<ProductVariantsEntity[]> {
    return await this.productVariantRepository.findByProductId(productId);
  }

  async getPage(filterObject: Record<string, unknown>): Promise<PaginationResponse<ProductVariantsEntity>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.productVariantRepository.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby as string | undefined,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }
}
