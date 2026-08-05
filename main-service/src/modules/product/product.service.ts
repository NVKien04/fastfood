import { buildPaginationResponse, PaginationResponse } from '#src/common/core/pagination';
import { CreateProductDto } from '#src/modules/product/dto/create-product.dto';
import { Product } from './domain/product.domain';
import type { IProductRepository } from './domain/product.repository.interface';
import { Fn } from '#src/utils/fn';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryService } from '#src/modules/category/category.service';
import { UpdateProductDto } from '#src/modules/product/dto/update-product.dto';
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
    const product = await this.findById(productId);
    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }
    return this.updateRaw(productId, updateData);
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
