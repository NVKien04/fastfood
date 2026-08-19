import { Inject, Injectable } from '@nestjs/common';
import { type IComboRepository } from '@/modules/combo/domain/repositories/combo.repository.interface';
import { CreateComboDto } from '@/modules/combo/presentation/dto/create-combo.dto';
import { Combo } from '@/modules/combo/domain/entities/combo.domain';
import { PaginationOptions, PaginationResponse, buildPaginationResponse } from '@/common/core';
import { type QueryWhere } from '@/common/types';
import { BusinessException } from '@/common/exception';
import { ErrorEnum } from '@/common/constants';

@Injectable()
export class ComboService {
  constructor(
    @Inject('IComboRepository')
    private readonly comboRepository: IComboRepository,
  ) {}

  // ==========================================
  // NHÓM 1: CÁC HÀM WRAPPER (ỦY QUYỀN REPOSITORY)
  // ==========================================

  async findById(id: string): Promise<Combo | null> {
    return this.comboRepository.findById(id);
  }

  async findOneRaw(condition: Partial<Combo>): Promise<Combo | null> {
    return this.comboRepository.findOne(condition);
  }

  async findBySlugRaw(slug: string): Promise<Combo | null> {
    return this.comboRepository.findBySlug(slug);
  }

  async findAllRaw(
    condition?: Partial<Combo>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Combo[]> {
    return this.comboRepository.findAll(condition, order, relations);
  }

  async save(entity: Partial<Combo>): Promise<Combo> {
    return this.comboRepository.create(entity);
  }

  async updateRaw(id: string, entity: Partial<Combo>): Promise<Combo | null> {
    return this.comboRepository.update(id, entity);
  }

  async deleteRaw(id: string): Promise<boolean> {
    return this.comboRepository.delete(id);
  }

  async findPaginated(options: PaginationOptions, where?: QueryWhere): Promise<[Combo[], number]> {
    return this.comboRepository.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  async create(createComboDto: CreateComboDto): Promise<Combo> {
    return this.save(createComboDto as Partial<Combo>);
  }

  async findAll(): Promise<Combo[]> {
    return this.findAllRaw();
  }

  async findOne(id: string): Promise<Combo> {
    const combo = await this.findById(id);
    if (!combo) {
      throw new BusinessException(ErrorEnum.COMBO_NOT_FOUND);
    }
    return combo;
  }

  async findBySlug(slug: string): Promise<Combo> {
    const combo = await this.findBySlugRaw(slug);
    if (!combo) {
      throw new BusinessException(ErrorEnum.COMBO_NOT_FOUND);
    }
    return combo;
  }

  async getPage(filterObject: Record<string, unknown>): Promise<PaginationResponse<Combo>> {
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

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.deleteRaw(id);
  }
}
