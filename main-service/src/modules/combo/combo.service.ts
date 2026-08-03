import { Inject, Injectable } from '@nestjs/common';
import type { IComboRepository } from './repository/combo.repository.interface';
import { CreateComboDto } from './dto/create-combo.dto';
import { CombosEntity } from '#src/entities/combos.entity';
import { buildPaginationResponse, PaginationResponse } from '#src/common/core/paganation';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

@Injectable()
export class ComboService {
  constructor(
    @Inject('IComboRepository')
    private readonly comboRepository: IComboRepository,
  ) {}

  async create(createComboDto: CreateComboDto): Promise<CombosEntity> {
    return this.comboRepository.create(createComboDto as Partial<CombosEntity>);
  }

  async findAll(): Promise<CombosEntity[]> {
    return this.comboRepository.findAll();
  }

  async findOne(id: string): Promise<CombosEntity> {
    const combo = await this.comboRepository.findById(id);
    if (!combo) {
      throw new BusinessException(ErrorEnum.COMBO_NOT_FOUND);
    }
    return combo;
  }

  async findBySlug(slug: string): Promise<CombosEntity> {
    const combo = await this.comboRepository.findBySlug(slug);
    if (!combo) {
      throw new BusinessException(ErrorEnum.COMBO_NOT_FOUND);
    }
    return combo;
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.comboRepository.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.comboRepository.delete(id);
  }
}
