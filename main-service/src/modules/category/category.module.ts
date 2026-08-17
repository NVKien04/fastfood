import { CategoryEntity, IngredientsEntity, ProductEntity } from '@/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from '@/modules/category/presentation/controllers/category.controller';
import { CategoryTypeOrmRepository } from '@/modules/category/infrastructure/repositories/category.typeorm.repository';
import { CategoryService } from '@/modules/category/application/services/category.service';

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
