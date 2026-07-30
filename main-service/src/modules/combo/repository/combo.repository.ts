import { Injectable } from '@nestjs/common';
import { BaseRepository } from '#src/shared/base/base.repository';
import { CombosEntity } from '#src/entities/combos.entity';
import { IComboRepository } from './combo.repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ComboRepository extends BaseRepository<CombosEntity> implements IComboRepository {
  constructor(
    @InjectRepository(CombosEntity) repo: Repository<CombosEntity>,
    private DataSource: DataSource,
  ) {
    super(repo);
  }

  async findById(id: string): Promise<CombosEntity | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['comboItems'],
    });
  }

  async findBySlug(slug: string): Promise<CombosEntity | null> {
    return this.repo.findOne({
      where: { slug },
      relations: ['comboItems'],
    });
  }
}
