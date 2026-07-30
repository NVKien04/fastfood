import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IComboRepository } from './repository/combo.repository.interface';
import { CreateComboDto } from './dto/create-combo.dto';
import { CombosEntity } from '#src/entities/combos.entity';

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
      throw new NotFoundException(`Combo with ID ${id} not found`);
    }
    return combo;
  }

  async findBySlug(slug: string): Promise<CombosEntity> {
    const combo = await this.comboRepository.findBySlug(slug);
    if (!combo) {
      throw new NotFoundException(`Combo with slug ${slug} not found`);
    }
    return combo;
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.comboRepository.delete(id);
  }
}
