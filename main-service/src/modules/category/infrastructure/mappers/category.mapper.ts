import { CategoryEntity } from '@/entities';
import { Category } from '@/modules/category/domain/entities/category.domain';
import { ProductMapper } from '@/modules/product/infrastructure/mappers/product.mapper';

export class CategoryMapper {
  static toDomain(ormEntity: CategoryEntity): Category {
    if (!ormEntity) return null as any;

    return new Category({
      id: ormEntity.id,
      name: ormEntity.name,
      slug: ormEntity.slug,
      description: ormEntity.description,
      sortOrder: ormEntity.sortOrder,
      isActive: Boolean(ormEntity.isActive),
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
      products: ormEntity.products ? ProductMapper.toDomainList(ormEntity.products) : undefined,
    });
  }

  static toDomainList(ormEntities: CategoryEntity[]): Category[] {
    if (!ormEntities) return [];
    return ormEntities.map((entity) => CategoryMapper.toDomain(entity));
  }

  static toOrmEntity(domainModel: Partial<Category>): Partial<CategoryEntity> {
    if (!domainModel) return {};

    const entity: Partial<CategoryEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.name !== undefined) entity.name = domainModel.name;
    if (domainModel.slug !== undefined) entity.slug = domainModel.slug;
    if (domainModel.description !== undefined) entity.description = domainModel.description;
    if (domainModel.sortOrder !== undefined) entity.sortOrder = domainModel.sortOrder;
    if (domainModel.isActive !== undefined) entity.isActive = domainModel.isActive ? 1 : 0;
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;
    if (domainModel.deletedAt !== undefined) entity.deletedAt = domainModel.deletedAt;

    return entity;
  }
}
