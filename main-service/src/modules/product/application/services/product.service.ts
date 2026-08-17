import { PaginationResponse, buildPaginationResponse } from '@/common/core';
import {
  CreateProductDto,
  ProductDetailResponseDto,
  ProductFilterDto,
  UpdateProductDto,
  UpdateProductStatusDto,
} from '@/modules/product/presentation/dto';
import { Product } from '@/modules/product/domain/entities/product.domain';
import { Fn } from '@/utils';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryService } from '@/modules/category/application/services/category.service';
import { ProductVariantService } from '@/modules/product-variant/application/services/product-variant.service';
import { IngredientService } from '@/modules/ingredient/application/services/ingredient.service';
import { BusinessException } from '@/common/exception';
import { ErrorEnum, REDIS_KEYS, REDIS_TTL } from '@/common/constants';
import { type ICacheService } from '@/modules/cache/domain/interface/cache.interface';
import { ProductHelper } from '@/modules/product/application/helpers/product.helper';
import type {
  IProductRepository,
  ProductFilterOptions,
} from '@/modules/product/domain/repositories/product.repository.interface';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,
    private readonly categoryService: CategoryService,
    private readonly productVariantService: ProductVariantService,
    private readonly ingredientService: IngredientService,
    @Inject('ICacheService')
    private readonly cacheService: ICacheService,
  ) {}

  private clearProductCache() {
    return this.cacheService.delByPattern(REDIS_KEYS.PRODUCT.PATTERN);
  }

  /**
   * Kiểm tra trùng lặp cặp (size, type) trong danh sách biến thể
   */
  private validateUniqueVariants(variants?: { size: string; type: string }[]): void {
    if (!variants || variants.length <= 1) return;
    const seen = new Set<string>();
    for (const variant of variants) {
      const key = `${variant.size}_${variant.type}`;
      if (seen.has(key)) {
        throw new BusinessException(ErrorEnum.PRODUCT_VARIANT_DUPLICATE);
      }
      seen.add(key);
    }
  }

  // ==========================================
  // NHÓM 1: CÁC HÀM WRAPPER (ỦY QUYỀN REPOSITORY)
  // ==========================================

  async executeTransaction<T>(callback: (manager: unknown) => Promise<T>): Promise<T> {
    return this.repo.executeTransaction(callback);
  }

  async findById(id: string): Promise<Product | null> {
    return this.repo.findById(id);
  }

  async findByIdOrThrow(id: string): Promise<Product> {
    const product = await this.findById(id);
    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }
    return product;
  }

  async findOne(condition: Partial<Product>): Promise<Product | null> {
    return this.repo.findOne(condition);
  }

  async findOneOrThrow(condition: Partial<Product>): Promise<Product> {
    const product = await this.findOne(condition);
    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }
    return product;
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

  async findPaginated(options: ProductFilterOptions): Promise<[Product[], number]> {
    return this.repo.findPaginated(options);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  /**
   * Tạo mới sản phẩm kèm variants trong một transaction.
   * Tự sinh slug từ name, kiểm tra trùng slug, trùng biến thể và danh mục.
   */
  async create(productDto: CreateProductDto): Promise<Product | null> {
    const category = await this.categoryService.getById(productDto.categoryId);
    if (!category) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }

    // Kiểm tra trùng lặp variants
    this.validateUniqueVariants(productDto.variants);

    const productSlug = Fn.changeNameToSlug(productDto.name);
    const existedProduct = await this.findOne({ slug: productSlug });
    if (existedProduct) {
      throw new BusinessException(ErrorEnum.PRODUCT_SLUG_EXISTED);
    }

    const product = await this.executeTransaction(async (manager) => {
      const createdProduct = await this.save(
        {
          name: productDto.name,
          slug: productSlug,
          description: productDto.description,
          basePrice: productDto.basePrice,
          sortOrder: productDto.sortOrder ?? 0,
          img: productDto.img,
          isFeatured: productDto.isFeatured ?? 0,
          categoryId: productDto.categoryId,
          isActive: 1,
        },
        manager,
      );

      // Tạo variants
      if (productDto.variants && productDto.variants.length > 0) {
        for (const variant of productDto.variants) {
          await this.productVariantService.create(variant, createdProduct.id, manager);
        }
      }

      return createdProduct;
    });

    if (product) {
      this.clearProductCache();
    }

    return product;
  }

  /**
   * Lấy danh sách sản phẩm phân trang và tìm kiếm/lọc nâng cao.
   * Filter: search, categoryId, isFeatured, isActive (mặc định 1), minPrice, maxPrice.
   */
  async getPage(filterObject: ProductFilterDto): Promise<PaginationResponse<Product>> {
    const cacheKey = `${REDIS_KEYS.PRODUCT.PAGE}${JSON.stringify(filterObject ?? {})}`;
    const cached = await this.cacheService.get<PaginationResponse<Product>>(cacheKey);
    if (cached) {
      return cached;
    }

    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
      orderDirection: filterObject?.orderDirection,
      search: filterObject?.search,
      categoryId: filterObject?.categoryId !== undefined ? Number(filterObject.categoryId) : undefined,
      isFeatured: filterObject?.isFeatured !== undefined ? Number(filterObject.isFeatured) : undefined,
      isActive: filterObject?.isActive !== undefined ? Number(filterObject.isActive) : 1,
      minPrice: filterObject?.minPrice !== undefined ? Number(filterObject.minPrice) : undefined,
      maxPrice: filterObject?.maxPrice !== undefined ? Number(filterObject.maxPrice) : undefined,
    });

    const response = buildPaginationResponse(data, totalItems, page, limit);
    await this.cacheService.set(cacheKey, response, REDIS_TTL.PRODUCT_PAGE);
    return response;
  }

  /**
   * Cập nhật sản phẩm và variants trong transaction.
   * Truyền variants mới sẽ kiểm tra trùng lặp, xóa cũ và tạo lại (replace strategy).
   */
  async update(productId: string, updateData: UpdateProductDto): Promise<Product | null> {
    const product = await this.findByIdOrThrow(productId);
    if (updateData.categoryId) {
      const category = await this.categoryService.getById(updateData.categoryId);
      if (!category) {
        throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
      }
    }

    // Kiểm tra trùng lặp variants nếu có truyền vào
    if (updateData.variants !== undefined) {
      this.validateUniqueVariants(updateData.variants);
    }

    const { variants, name, ...scalarFields } = updateData;
    const updatePayload: Partial<Product> = { ...scalarFields };
    if (name !== undefined) {
      updatePayload.name = name;
      const newSlug = Fn.changeNameToSlug(name);
      if (newSlug !== product.slug) {
        const existedProduct = await this.findOne({ slug: newSlug });
        if (existedProduct && existedProduct.id !== productId) {
          throw new BusinessException(ErrorEnum.PRODUCT_SLUG_EXISTED);
        }
        updatePayload.slug = newSlug;
      }
    }

    const updatedProduct = await this.executeTransaction(async (manager) => {
      if (Object.keys(updatePayload).length > 0) {
        await this.updateRaw(productId, updatePayload, manager);
      }
      // Replace variants nếu được truyền vào
      if (variants !== undefined) {
        await this.productVariantService.deleteByProductId(productId, manager);
        for (const variant of variants) {
          await this.productVariantService.create(variant, productId, manager);
        }
      }
      return this.findById(productId);
    });

    if (updatedProduct) {
      this.clearProductCache();
    }

    return updatedProduct;
  }

  /**
   * Cập nhật trạng thái nhanh (isActive, isFeatured).
   */
  async updateStatus(productId: string, statusDto: UpdateProductStatusDto): Promise<Product | null> {
    await this.findByIdOrThrow(productId);
    const updatePayload: Partial<Product> = {};
    if (statusDto.isActive !== undefined) {
      updatePayload.isActive = statusDto.isActive;
    }
    if (statusDto.isFeatured !== undefined) {
      updatePayload.isFeatured = statusDto.isFeatured;
    }

    if (Object.keys(updatePayload).length === 0) {
      return this.findById(productId);
    }

    const updated = await this.updateRaw(productId, updatePayload);
    if (updated) {
      this.clearProductCache();
    }
    return updated;
  }

  /**
   * Xóa mềm sản phẩm theo ID.
   */
  async delete(productId: string): Promise<boolean> {
    await this.findByIdOrThrow(productId);
    const result = await this.softDeleteRaw(productId);
    if (result) {
      this.clearProductCache();
    }
    return result;
  }

  /**
   * Lấy chi tiết sản phẩm theo ID, bao gồm variants và ingredients theo danh mục.
   */
  async getDetail(productId: string): Promise<ProductDetailResponseDto> {
    const cacheKey = `${REDIS_KEYS.PRODUCT.DETAIL_ID}${productId}`;
    const cached = await this.cacheService.get<ProductDetailResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.findByIdOrThrow(productId);
    const detail = await ProductHelper.buildDetail(product, this.productVariantService, this.ingredientService);
    await this.cacheService.set(cacheKey, detail, REDIS_TTL.PRODUCT_DETAIL);
    return detail;
  }

  /**
   * Lấy chi tiết sản phẩm theo slug, bao gồm variants và ingredients theo danh mục.
   */
  async getDetailBySlug(slug: string): Promise<ProductDetailResponseDto> {
    const cacheKey = `${REDIS_KEYS.PRODUCT.DETAIL_SLUG}${slug}`;
    const cached = await this.cacheService.get<ProductDetailResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.findOneOrThrow({ slug });
    const detail = await ProductHelper.buildDetail(product, this.productVariantService, this.ingredientService);
    await this.cacheService.set(cacheKey, detail, REDIS_TTL.PRODUCT_DETAIL);
    return detail;
  }

  /**
   * Lấy danh sách sản phẩm liên quan (cùng danh mục, loại trừ sản phẩm hiện tại).
   */
  async getRelatedProducts(productId: string, limit = 6): Promise<Product[]> {
    const product = await this.findByIdOrThrow(productId);
    const allCategoryProducts = await this.findAll(
      { categoryId: product.categoryId, isActive: 1 },
      { sortOrder: 'ASC' },
    );
    return allCategoryProducts.filter((p) => p.id !== productId).slice(0, limit);
  }
}
