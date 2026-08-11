import { buildPaginationResponse, PaginationResponse } from '#src/common/core/pagination';
import { CreateProductDto } from '../../presentation/dto/create-product.dto';
import { Product } from '../../domain/entities/product.domain';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface';
import { Fn } from '#src/utils/fn';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryService } from '#src/modules/category/application/services/category.service';
import { UpdateProductDto } from '../../presentation/dto/update-product.dto';
import { ProductVariantService } from '#src/modules/product-variant/application/services/product-variant.service';
import { ProductIngredientService } from '#src/modules/product-ingredient/application/services/product-ingredient.service';
import { IngredientService } from '#src/modules/ingredient/application/services/ingredient.service';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,
    private readonly categoryService: CategoryService,
    private readonly productVariantService: ProductVariantService,
    private readonly productIngredientService: ProductIngredientService,
    private readonly ingredientService: IngredientService,
  ) {}

  // ==========================================
  // NHÓM 1: CÁC HÀM WRAPPER (ỦY QUYỀN REPOSITORY)
  // ==========================================

  async executeTransaction<T>(callback: (manager: unknown) => Promise<T>): Promise<T> {
    return this.repo.executeTransaction(callback);
  }

  async findById(id: string): Promise<Product | null> {
    return this.repo.findById(id);
  }

  async findOne(condition: Partial<Product>): Promise<Product | null> {
    return this.repo.findOne(condition);
  }

  async findAll(
    condition?: Partial<Product>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Product[]> {
    return this.repo.findAll(condition, order, relations);
  }

  async save(entity: Partial<Product>, manager?: unknown): Promise<Product> {
    return this.repo.create(entity, manager);
  }

  async updateRaw(id: string, entity: Partial<Product>, manager?: unknown): Promise<Product | null> {
    return this.repo.update(id, entity, manager);
  }

  async softDeleteRaw(id: string, manager?: unknown): Promise<boolean> {
    return this.repo.softDelete(id, manager);
  }

  async findPaginated(options: any, where?: Record<string, any>): Promise<[Product[], number]> {
    return this.repo.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  async create(productDto: CreateProductDto): Promise<Product | null> {
    return this.executeTransaction(async (manager) => {
      const category = await this.categoryService.getById(productDto.categoryId);
      if (!category) {
        throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
      }
      const productSlug = Fn.changeNameToSlug(productDto.name);
      const existedProduct = await this.findOne({ slug: productSlug });
      if (existedProduct) {
        throw new BusinessException(ErrorEnum.PRODUCT_SLUG_EXISTED);
      }
      const createProductData: Partial<Product> = {
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
      const product = await this.save(createProductData, manager);

      if (productDto.variants && productDto.variants.length > 0 && product) {
        for (const variant of productDto.variants) {
          await this.productVariantService.create(variant, product.id, manager);
        }
      }
      if (productDto.ingredients && productDto.ingredients.length > 0 && product) {
        for (const ingredient of productDto.ingredients) {
          const existedIngredient = await this.ingredientService.findById(ingredient.ingredientId);
          if (!existedIngredient) {
            throw new BusinessException(ErrorEnum.INGREDIENT_NOT_FOUND);
          }
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

    const where = { isFeatured: 1 };

    const [data, totalItems] = await this.findPaginated(
      {
        skip,
        take: limit,
        orderBy: filterObject?.orderby,
      },
      where,
    );

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async update(productId: string, updateData: UpdateProductDto): Promise<Product | null> {
    return this.executeTransaction(async (manager) => {
      const product = await this.findById(productId);
      if (!product) {
        throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
      }

      if (updateData.categoryId) {
        const category = await this.categoryService.getById(updateData.categoryId);
        if (!category) {
          throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
        }
      }

      const updatePayload: Partial<Product> = {};

      if (updateData.name !== undefined) {
        updatePayload.name = updateData.name;
        const newSlug = Fn.changeNameToSlug(updateData.name);
        if (newSlug !== product.slug) {
          const existedProduct = await this.findOne({ slug: newSlug });
          if (existedProduct && existedProduct.id !== productId) {
            throw new BusinessException(ErrorEnum.PRODUCT_SLUG_EXISTED);
          }
          updatePayload.slug = newSlug;
        }
      }

      if (updateData.description !== undefined) updatePayload.description = updateData.description;
      if (updateData.basePrice !== undefined) updatePayload.basePrice = updateData.basePrice;
      if (updateData.sortOrder !== undefined) updatePayload.sortOrder = updateData.sortOrder;
      if (updateData.img !== undefined) updatePayload.img = updateData.img;
      if (updateData.isFeatured !== undefined) updatePayload.isFeatured = updateData.isFeatured;
      if (updateData.categoryId !== undefined) updatePayload.categoryId = updateData.categoryId;

      if (Object.keys(updatePayload).length > 0) {
        await this.updateRaw(productId, updatePayload, manager);
      }

      // Cập nhật variants nếu được truyền vào
      if (updateData.variants !== undefined) {
        await this.productVariantService.deleteByProductId(productId, manager);
        if (updateData.variants.length > 0) {
          for (const variant of updateData.variants) {
            await this.productVariantService.create(variant, productId, manager);
          }
        }
      }

      // Cập nhật ingredients nếu được truyền vào
      if (updateData.ingredients !== undefined) {
        await this.productIngredientService.deleteByProductId(productId, manager);
        if (updateData.ingredients.length > 0) {
          for (const ingredient of updateData.ingredients) {
            const existedIngredient = await this.ingredientService.findById(ingredient.ingredientId);
            if (!existedIngredient) {
              throw new BusinessException(ErrorEnum.INGREDIENT_NOT_FOUND);
            }
            await this.productIngredientService.create(ingredient, productId, manager);
          }
        }
      }

      return this.findById(productId);
    });
  }

  async delete(productId: string) {
    const product = await this.findById(productId);
    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }
    return this.softDeleteRaw(productId);
  }

  async getById(productId: string): Promise<Product | null> {
    return this.findById(productId);
  }
}
