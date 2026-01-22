import { PaginationResponse } from '#src/common/core/paganation';
import { CreateProductDto } from '#src/dtos/product/create-product.dto';
import { ProductEntity } from '#src/entities/product.entity';
import type { IProductRepository } from '#src/repositories/product/product.repository.interface';
import { Fn } from '#src/utils/fn';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UpdateProductDto } from '#src/dtos/product/update-product.dto';
import { DataSource } from 'typeorm/data-source/index.js';
import { ProductVariantService } from './productVariant.service';
import { ProductIngredientService } from './productIngredient.Service';
import { IngredientService } from './ingredient.service';

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
      const category = await this.categoryService.getById(
        productDto.categoryId,
      );
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      const productSlug = Fn.changeNameToSlug(productDto.name);
      const existedProduct = await this.repo.findOne({ slug: productSlug });
      if (existedProduct) {
        throw new NotFoundException('Product with this slug already exists');
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
      console.log('Created Product:', product);

      if (productDto.variants && productDto.variants.length > 0 && product) {
        for (const variant of productDto.variants) {
          await this.productVariantService.create(variant, product.id, manager);
        }
      }
      if (
        productDto.ingredients &&
        productDto.ingredients.length > 0 &&
        product
      ) {
        const ingredients = await this.ingredientService.findByCategoryId(
          productDto.categoryId,
        );
        if (ingredients.length === 0) {
          throw new NotFoundException(
            'No ingredients found for the given category',
          );
        }
        for (const ingredient of productDto.ingredients) {
          await this.productIngredientService.create(
            ingredient,
            product.id,
            manager,
          );
        }
      }
      return product;
    });
  }

  async getPage(FilterObject: any): Promise<PaginationResponse<any>> {
    return await this.repo.GetPage(FilterObject);
  }

  async update(
    productId: string,
    updateData: UpdateProductDto,
  ): Promise<ProductEntity | null> {
    const product = await this.repo.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return this.repo.update(productId, updateData);
  }

  async delete(productId: string) {
    return this.repo.softDelete(productId);
  }

  async getById(productId: string): Promise<ProductEntity | null> {
    return this.repo.findById(productId);
  }
}
