import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombosEntity } from '@/entities/combos.entity';
import { ComboItemsEntity } from '@/entities/combo-items.entity';
import { ComboController } from '@/modules/combo/presentation/controllers/combo.controller';
import { ComboService } from '@/modules/combo/application/services/combo.service';
import { ComboTypeOrmRepository } from '@/modules/combo/infrastructure/repositories/combo.typeorm.repository';

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
