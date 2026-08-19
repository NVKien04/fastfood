import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComboItemsEntity, CombosEntity } from '@/entities';
import { ComboController } from '@/modules/combo/presentation/controllers/combo.controller';
import { ComboService } from '@/modules/combo/application/services/combo.service';
import { ComboTypeOrmRepository } from '@/modules/combo/infrastructure/persistence/typeorm/combo.typeorm.repository';

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
