import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CombosEntity } from '#src/entities/combos.entity';
import { ComboItemsEntity } from '#src/entities/combo-items.entity';
import { ComboController } from './combo.controller';
import { ComboService } from './combo.service';
import { ComboRepository } from './repository/combo.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CombosEntity, ComboItemsEntity])],
  controllers: [ComboController],
  providers: [
    ComboService,
    {
      provide: 'IComboRepository',
      useClass: ComboRepository,
    },
  ],
  exports: [ComboService],
})
export class ComboModule {}
