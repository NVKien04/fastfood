import { PaginationOptions, PaginationResponse, buildPaginationResponse } from '@/common/core';
import { type QueryWhere } from '@/common/types';
import { ErrorEnum } from '@/common/constants';
import { BusinessException } from '@/common/exception';
import { Fn } from '@/utils';
import { Inject, Injectable } from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from '@/modules/category/presentation/dto';
import { Category } from '@/modules/category/domain/entities/category.domain';
import { type ICategoryRepository } from '@/modules/category/domain/repositories/category.repository.interface';

@Injectable()
export class CategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly repo: ICategoryRepository,
  ) {}

  // ==========================================
  // NHÓM 1: CÁC HÀM WRAPPER (ỦY QUYỀN REPOSITORY)
  // ==========================================

  async findById(id: number): Promise<Category | null> {
    return this.repo.findById(id);
  }

  async findByIdOrThrow(id: number): Promise<Category> {
    const category = await this.findById(id);
    if (!category) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }
    return category;
  }

  async findOne(condition: Partial<Category>, relations?: string[]): Promise<Category | null> {
    return this.repo.findOne(condition, relations);
  }

  async findOneOrThrow(condition: Partial<Category>, relations?: string[]): Promise<Category> {
    const category = await this.findOne(condition, relations);
    if (!category) {
      throw new BusinessException(ErrorEnum.CATEGORY_NOT_FOUND);
    }
    return category;
  }

  async findAll(
    condition?: Partial<Category>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Category[]> {
    return this.repo.findAll(condition, order, relations);
  }

  async save(entity: Partial<Category>): Promise<Category> {
    return this.repo.create(entity);
  }

  async updateRaw(id: number, entity: Partial<Category>): Promise<Category | null> {
    return this.repo.update(id, entity);
  }

  async softDeleteRaw(id: number): Promise<boolean> {
    return this.repo.softDelete(id);
  }

  async findPaginated(options: PaginationOptions, where?: QueryWhere): Promise<[Category[], number]> {
    return this.repo.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  async create(createCategory: CreateCategoryDto): Promise<Category | null> {
    const slug = Fn.changeNameToSlug(createCategory.name);
    const existed = await this.findOne({ slug });
    if (existed) {
      throw new BusinessException(ErrorEnum.CATEGORY_EXISTED);
    }
    const categoryData: Partial<Category> = {
      ...createCategory,
      slug,
      isActive: createCategory.isActive !== undefined ? Boolean(createCategory.isActive) : undefined,
    };

    return await this.save(categoryData);
  }

  async update(updateCategoryDto: UpdateCategoryDto, id: number): Promise<Category | null> {
    await this.findByIdOrThrow(id);

    const payload: Partial<Category> = {
      ...updateCategoryDto,
      isActive: updateCategoryDto.isActive !== undefined ? Boolean(updateCategoryDto.isActive) : undefined,
    };

    return this.updateRaw(id, payload);
  }

  async delete(categoryId: number): Promise<boolean> {
    await this.findByIdOrThrow(categoryId);
    return await this.softDeleteRaw(categoryId);
  }

  async getPage(filterObject: Record<string, unknown>): Promise<PaginationResponse<Category>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.findPaginated({
      skip,
      take: limit,
      orderBy: typeof filterObject?.orderby === 'string' ? filterObject.orderby : undefined,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async getWithProducts(id: number): Promise<Category | null> {
    return this.findOne({ id }, ['products']);
  }

  async getById(categoryId: number): Promise<Category | null> {
    return this.findById(categoryId);
  }

  async getBySlug(slug: string): Promise<Category | null> {
    return this.findOne({ slug });
  }
}
