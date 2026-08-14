import { buildPaginationResponse, PaginationOptions, PaginationResponse } from '@/common/core/pagination';
import { CreateProductDto } from '@/modules/product/presentation/dto/create-product.dto';
import { ProductFilterDto } from '@/modules/product/presentation/dto/product-filter.dto';
import { ProductDetailResponseDto } from '@/modules/product/presentation/dto/product-detail-response.dto';
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
import { RedisService } from '@/modules/redis/redis.service';
import { REDIS_KEYS, REDIS_TTL } from '@/common/constants/redis.constaint';
import { ProductHelper } from '@/modules/product/application/helpers/product.helper';

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
    const product = await this.findByIdOrThrow(productId);
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
    const cached = await this.redisService.get<ProductDetailResponseDto>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.findByIdOrThrow(productId);
    const detail = await ProductHelper.buildDetail(product, this.productVariantService, this.ingredientService);
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

    const product = await this.findOneOrThrow({ slug });
    const detail = await ProductHelper.buildDetail(product, this.productVariantService, this.ingredientService);
    await this.redisService.set(cacheKey, detail, REDIS_TTL.PRODUCT_DETAIL);
    return detail;
  }
}
