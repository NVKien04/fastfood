import { ProductEntity } from '#src/entities/product.entity';
import { Product } from '../../domain/entities/product.domain';

export class ProductMapper {
  static toDomain(ormEntity: ProductEntity): Product {
    if (!ormEntity) return null as any;

    return new Product({
      id: ormEntity.id,
      name: ormEntity.name,
      slug: ormEntity.slug,
      description: ormEntity.description,
      basePrice: ormEntity.basePrice,
      sortOrder: ormEntity.sortOrder,
      img: ormEntity.img,
      isFeatured: ormEntity.isFeatured,
      categoryId: ormEntity.categoryId,
      isActive: ormEntity.isActive,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
    });
  }

  static toDomainList(ormEntities: ProductEntity[]): Product[] {
    if (!ormEntities) return [];
    return ormEntities.map((entity) => ProductMapper.toDomain(entity));
  }

  static toOrmEntity(domainModel: Partial<Product>): Partial<ProductEntity> {
    if (!domainModel) return {};

    const entity: Partial<ProductEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.name !== undefined) entity.name = domainModel.name;
    if (domainModel.slug !== undefined) entity.slug = domainModel.slug;
    if (domainModel.description !== undefined) entity.description = domainModel.description;
    if (domainModel.basePrice !== undefined) entity.basePrice = domainModel.basePrice;
    if (domainModel.sortOrder !== undefined) entity.sortOrder = domainModel.sortOrder;
    if (domainModel.img !== undefined) entity.img = domainModel.img;
    if (domainModel.isFeatured !== undefined) entity.isFeatured = domainModel.isFeatured;
    if (domainModel.categoryId !== undefined) entity.categoryId = domainModel.categoryId;
    if (domainModel.isActive !== undefined) entity.isActive = domainModel.isActive;
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;
    if (domainModel.deletedAt !== undefined) entity.deletedAt = domainModel.deletedAt;

    return entity;
  }
}
