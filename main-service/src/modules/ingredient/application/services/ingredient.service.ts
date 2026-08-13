import { buildPaginationResponse, PaginationResponse } from '@/common/core/pagination';
import { CreateIngredientDto } from '@/modules/ingredient/presentation/dto/create-ingredient.dto';
import { UpdateIngredientDto } from '@/modules/ingredient/presentation/dto/update-ingredient.dto';
import { BusinessException } from '@/common/exception/biz.exception';
import { ErrorEnum } from '@/common/constants/error-code.constant';
import { Inject, Injectable } from '@nestjs/common';

import { Ingredient } from '@/modules/ingredient/domain/entities/ingredient.domain';
import type { IIngredientRepository } from '@/modules/ingredient/domain/repositories/ingredient.repository.interface';

@Injectable()
export class IngredientService {
  constructor(
    @Inject('IIngredientRepository')
    private readonly ingredientRepository: IIngredientRepository,
  ) {}

  // ==========================================
  // NHÓM 1: CÁC HÀM WRAPPER (ỦY QUYỀN REPOSITORY)
  // ==========================================

  async findById(id: number): Promise<Ingredient | null> {
    return this.ingredientRepository.findById(id);
  }

  async findByIds(ids: number[]): Promise<Ingredient[]> {
    return this.ingredientRepository.findByIds(ids);
  }

  async findOne(condition: Partial<Ingredient>): Promise<Ingredient | null> {
    return this.ingredientRepository.findOne(condition);
  }

  async findAll(
    condition?: Partial<Ingredient>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Ingredient[]> {
    return this.ingredientRepository.findAll(condition, order, relations);
  }

  async save(entity: Partial<Ingredient>): Promise<Ingredient> {
    return this.ingredientRepository.create(entity);
  }

  async updateRaw(id: number, entity: Partial<Ingredient>): Promise<Ingredient | null> {
    return this.ingredientRepository.update(id, entity);
  }

  async softDeleteRaw(id: number): Promise<boolean> {
    return this.ingredientRepository.softDelete(id);
  }

  async findPaginated(options: any, where?: Record<string, any>): Promise<[Ingredient[], number]> {
    return this.ingredientRepository.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  async create(data: CreateIngredientDto): Promise<Ingredient> {
    return this.save(data);
  }

  async findByCategoryId(categoryId: number): Promise<Ingredient[]> {
    return this.findAll({ categoryId });
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async update(id: number, data: UpdateIngredientDto): Promise<Ingredient | null> {
    const ingredient = await this.findById(id);
    if (!ingredient) {
      throw new BusinessException(ErrorEnum.INGREDIENT_NOT_FOUND);
    }
    return this.updateRaw(id, data);
  }

  async delete(id: number) {
    const ingredient = await this.findById(id);
    if (!ingredient) {
      throw new BusinessException(ErrorEnum.INGREDIENT_NOT_FOUND);
    }
    return this.softDeleteRaw(id);
  }
}
