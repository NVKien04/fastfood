import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombosEntity } from '#src/entities/combos.entity';
import { ComboItemsEntity } from '#src/entities/combo-items.entity';
import { ComboController } from './presentation/controllers/combo.controller';
import { ComboService } from './application/services/combo.service';
import { ComboTypeOrmRepository } from './infrastructure/repositories/combo.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CombosEntity, ComboItemsEntity])],
  controllers: [ComboController],
  providers: [
    ComboService,
    {
      provide: 'IComboRepository',
      useClass: ComboTypeOrmRepository,
    },
  ],
  exports: [ComboService],
})
export class ComboModule {}
