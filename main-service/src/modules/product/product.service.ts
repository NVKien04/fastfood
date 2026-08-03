import { buildPaginationResponse, PaginationResponse } from '#src/common/core/paganation';
import { CreateProductDto } from '#src/modules/product/dto/create-product.dto';
import { ProductEntity } from '#src/entities/product.entity';
import type { IProductRepository } from '#src/modules/product/repository/product.repository.interface';
import { Fn } from '#src/utils/fn';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryService } from '#src/modules/category/category.service';
import { UpdateProductDto } from '#src/modules/product/dto/update-product.dto';
import { DataSource } from 'typeorm';
import { ProductVariantService } from '#src/modules/product-variant/product-variant.service';
import { ProductIngredientService } from '#src/modules/product-ingredient/product-ingredient.service';
import { IngredientService } from '#src/modules/ingredient/ingredient.service';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,
    private readonly dataSource: DataSource,
    private readonly categoryService: CategoryService,
    private readonly productVariantService: ProductVariantService,
    private readonly productIngredientService: ProductIngredientService,
    private readonly ingredientService: IngredientService,
  ) {}

  async create(productDto: CreateProductDto): Promise<ProductEntity | null> {
    return this.dataSource.transaction(async (manager) => {
      const category = await this.categoryService.getById(productDto.categoryId);
      if (!category) {
        throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
      }
      const productSlug = Fn.changeNameToSlug(productDto.name);
      const existedProduct = await this.repo.findOne({ slug: productSlug });
      if (existedProduct) {
        throw new BusinessException(ErrorEnum.PRODUCT_SLUG_EXISTED);
      }
      const createProductData: Partial<ProductEntity> = {
        name: productDto.name,
        slug: productSlug,
        description: productDto.description,
        basePrice: productDto.basePrice,
        sortOrder: productDto.sortOrder,
        img: productDto.img,
        isFeatured: productDto.isFeatured ?? 1,
        categoryId: productDto.categoryId,
        isActive: 1,
      };
      const product = await this.repo.create(createProductData, manager);

      if (productDto.variants && productDto.variants.length > 0 && product) {
        for (const variant of productDto.variants) {
          await this.productVariantService.create(variant, product.id, manager);
        }
      }
      if (productDto.ingredients && productDto.ingredients.length > 0 && product) {
        const ingredients = await this.ingredientService.findByCategoryId(productDto.categoryId);
        if (ingredients.length === 0) {
          throw new BusinessException(ErrorEnum.INGREDIENT_NOT_FOUND);
        }
        for (const ingredient of productDto.ingredients) {
          await this.productIngredientService.create(ingredient, product.id, manager);
        }
      }
      return product;
    });
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    // Business filter: chỉ lấy các sản phẩm nổi bật
    const where = { isFeatured: 1 };

    const [data, totalItems] = await this.repo.findPaginated(
      {
        skip,
        take: limit,
        orderBy: filterObject?.orderby,
      },
      where,
    );

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async update(productId: string, updateData: UpdateProductDto): Promise<ProductEntity | null> {
    const product = await this.repo.findById(productId);
    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }
    return this.repo.update(productId, updateData);
  }

  async delete(productId: string) {
    const product = await this.repo.findById(productId);
    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }
    return this.repo.softDelete(productId);
  }

  async getById(productId: string): Promise<ProductEntity | null> {
    return this.repo.findById(productId);
  }
}
