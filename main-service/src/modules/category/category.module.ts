import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { ProductEntity } from '#src/entities/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './presentation/controllers/category.controller';
import { CategoryEntity } from '#src/entities/category.entity';
import { CategoryTypeOrmRepository } from './infrastructure/repositories/category.typeorm.repository';
import { CategoryService } from './application/services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, IngredientsEntity, ProductEntity])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: 'ICategoryRepository',
      useClass: CategoryTypeOrmRepository,
    },
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
