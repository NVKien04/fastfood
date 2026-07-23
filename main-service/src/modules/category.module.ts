import { IngredientsEntity } from '#src/entities/ingredients.entity';
import { ProductEntity } from '#src/entities/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from 'src/controllers/category.controller';
import { CategoryEntity } from 'src/entities/category.entity';

import { CategoryRepository } from 'src/repositories/category/category.repository';

import { CategoryService } from 'src/services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, IngredientsEntity, ProductEntity])],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: 'ICategoryRepository',
      useClass: CategoryRepository,
    },
  ],

  exports: [CategoryService],
})
export class CategoryModule {}
