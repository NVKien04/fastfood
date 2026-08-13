import { buildPaginationResponse, PaginationOptions, PaginationResponse } from '@/common/core/pagination';
import { CreateProductDto } from '@/modules/product/presentation/dto/create-product.dto';
import { ProductFilterDto } from '@/modules/product/presentation/dto/product-filter.dto';
import {
  ProductDetailResponseDto,
  ProductVariantResponseDto,
  ProductIngredientResponseDto,
} from '@/modules/product/presentation/dto/product-detail-response.dto';
import { Product } from '@/modules/product/domain/entities/product.domain';
import type { IProductRepository } from '@/modules/product/domain/repositories/product.repository.interface';
import { Fn } from '@/utils/fn';
import { Inject, Injectable } from '@nestjs/common';
import { CategoryService } from '@/modules/category/application/services/category.service';
import { UpdateProductDto } from '@/modules/product/presentation/dto/update-product.dto';
import { ProductVariantService } from '@/modules/product-variant/application/services/product-variant.service';
import { IngredientService } from '@/modules/ingredient/application/services/ingredient.service';
import { BusinessException } from '@/common/exception/biz.exception';
import { ErrorEnum } from '@/common/constants/error-code.constant';
import { Ingredient } from '@/modules/ingredient/domain/entities/ingredient.domain';
import { ProductVariantsEntity } from '@/entities/product_variants.entity';
import { RedisService } from '@/modules/redis/redis.service';
import { REDIS_KEYS, REDIS_TTL } from '@/common/constants/redis.constaint';

@Injectable()
export class ProductService {
  constructor(
    @Inject('IProductRepository')
    private readonly repo: IProductRepository,
    private readonly categoryService: CategoryService,
    private readonly productVariantService: ProductVariantService,
    private readonly ingredientService: IngredientService,
    private readonly redisService: RedisService,
  ) {}

  private clearProductCache() {
    return this.redisService.delByPattern(REDIS_KEYS.PRODUCT.PATTERN);
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

  async findPaginated(options: PaginationOptions, where?: Record<string, unknown>): Promise<[Product[], number]> {
    return this.repo.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  /**
   * Tạo mới sản phẩm kèm variants trong một transaction.
   * Tự sinh slug từ name, kiểm tra trùng slug và danh mục.
   */
  /**
   * Tạo mới sản phẩm kèm variants trong một transaction.
   * Tự sinh slug từ name, kiểm tra trùng slug và danh mục.
   */
  async create(productDto: CreateProductDto): Promise<Product | null> {
    const category = await this.categoryService.getById(productDto.categoryId);
    if (!category) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }

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
   * Lấy danh sách sản phẩm phân trang.
   * Filter: isActive (mặc định chỉ lấy active), isFeatured (tuỳ chọn), categoryId (tuỳ chọn).
   */
  async getPage(filterObject: ProductFilterDto): Promise<PaginationResponse<Product>> {
    const cacheKey = `${REDIS_KEYS.PRODUCT.PAGE}${JSON.stringify(filterObject ?? {})}`;
    const cached = await this.redisService.get<PaginationResponse<Product>>(cacheKey);
    if (cached) {
      return cached;
    }

    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = { isActive: 1 };
    if (filterObject?.isFeatured !== undefined) {
      where['isFeatured'] = Number(filterObject.isFeatured);
    }
    if (filterObject?.categoryId !== undefined) {
      where['categoryId'] = Number(filterObject.categoryId);
    }

    const [data, totalItems] = await this.findPaginated(
      {
        skip,
        take: limit,
        orderBy: filterObject?.orderby,
        orderDirection: filterObject?.orderDirection,
      },
      where,
    );

    const response = buildPaginationResponse(data, totalItems, page, limit);
    await this.redisService.set(cacheKey, response, REDIS_TTL.PRODUCT_PAGE);
    return response;
  }

  /**
   * Cập nhật sản phẩm và variants trong transaction.
   * Truyền variants mới sẽ xóa cũ và tạo lại (replace strategy).
   */
  async update(productId: string, updateData: UpdateProductDto): Promise<Product | null> {
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
   * Xóa mềm sản phẩm theo ID.
   */
  async delete(productId: string): Promise<boolean> {
    const product = await this.findById(productId);
    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }
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
    const cached = await this.redisService.get<ProductDetailResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.findById(productId);
    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }
    const detail = await this.buildDetail(product);
    await this.redisService.set(cacheKey, detail, REDIS_TTL.PRODUCT_DETAIL);
    return detail;
  }

  /**
   * Lấy chi tiết sản phẩm theo slug, bao gồm variants và ingredients theo danh mục.
   */
  async getDetailBySlug(slug: string): Promise<ProductDetailResponseDto> {
    const cacheKey = `${REDIS_KEYS.PRODUCT.DETAIL_SLUG}${slug}`;
    const cached = await this.redisService.get<ProductDetailResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.findOne({ slug });
    if (!product) {
      throw new BusinessException(ErrorEnum.PRODUCT_NOT_FOUND);
    }
    const detail = await this.buildDetail(product);
    await this.redisService.set(cacheKey, detail, REDIS_TTL.PRODUCT_DETAIL);
    return detail;
  }

  // ==========================================
  // PRIVATE HELPERS
  // ==========================================

  /**
   * Lấy variants và ingredients (dựa theo categoryId của sản phẩm) song song.
   */
  private async buildDetail(product: Product): Promise<ProductDetailResponseDto> {
    const [variants, categoryIngredients] = await Promise.all([
      this.productVariantService.findByProductId(product.id),
      this.ingredientService.findByCategoryId(product.categoryId),
    ]);

    return this.toDetailDto(product, variants, categoryIngredients);
  }

  private toDetailDto(
    product: Product,
    rawVariants: ProductVariantsEntity[],
    categoryIngredients: Ingredient[],
  ): ProductDetailResponseDto {
    const variants: ProductVariantResponseDto[] = rawVariants.map((v) => ({
      id: v.id,
      name: v.name,
      size: v.size,
      type: v.type,
      modifiedPrice: v.modifiedPrice,
      sortOrder: v.sortOrder,
      isActive: v.isActive,
    }));

    const ingredients: ProductIngredientResponseDto[] = categoryIngredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      imageUrl: ing.imageUrl,
      description: ing.description,
      price: ing.price,
      isRequired: Number(ing.isRequired ?? 1),
      isActive: Number(ing.isActive ?? 1),
      categoryId: ing.categoryId,
    }));

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      basePrice: product.basePrice,
      sortOrder: product.sortOrder,
      img: product.img,
      isFeatured: product.isFeatured,
      categoryId: product.categoryId,
      isActive: product.isActive,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      variants,
      ingredients,
    };
  }
}
