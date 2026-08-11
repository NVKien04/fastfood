import { buildPaginationResponse, PaginationResponse } from '#src/common/core/pagination';
import { CreateProductVariantDto } from '#src/modules/product/presentation/dto/create-product.dto';
import type { IProductVariantRepository } from '../../domain/repositories/product-variant.repository.interface';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class ProductVariantService {
  constructor(
    @Inject('IProductVariantRepository')
    private readonly productVariantRepository: IProductVariantRepository,
  ) {}

  async create(data: CreateProductVariantDto, productId: string, manager?: unknown): Promise<any> {
    return await this.productVariantRepository.create({ ...data, productId }, manager);
  }

  async deleteByProductId(productId: string, manager?: unknown): Promise<any> {
    return await this.productVariantRepository.deleteByProductId(productId, manager);
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.productVariantRepository.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }
}
