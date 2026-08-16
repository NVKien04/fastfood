import { ProductVariantsEntity } from '@/entities/product_variants.entity';
import { ProductVariant } from '@/modules/product-variant/domain/entities/product-variant.domain';

export class ProductVariantMapper {
  static toDomain(ormEntity: ProductVariantsEntity | null): ProductVariant | null {
    if (!ormEntity) return null;

    return new ProductVariant({
      id: ormEntity.id,
      name: ormEntity.name,
      size: ormEntity.size,
      type: ormEntity.type,
      modifiedPrice: ormEntity.modifiedPrice,
      isActive: ormEntity.isActive,
      sortOrder: ormEntity.sortOrder,
      productId: ormEntity.productId,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
    });
  }

  static toDomainList(ormEntities: ProductVariantsEntity[]): ProductVariant[] {
    if (!ormEntities) return [];
    return ormEntities
      .map((entity) => ProductVariantMapper.toDomain(entity))
      .filter((v): v is ProductVariant => v !== null);
  }

  static toOrmEntity(domainModel: Partial<ProductVariant>): Partial<ProductVariantsEntity> {
    if (!domainModel) return {};

    const entity: Partial<ProductVariantsEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.name !== undefined) entity.name = domainModel.name;
    if (domainModel.size !== undefined) entity.size = domainModel.size;
    if (domainModel.type !== undefined) entity.type = domainModel.type;
    if (domainModel.modifiedPrice !== undefined) entity.modifiedPrice = domainModel.modifiedPrice;
    if (domainModel.isActive !== undefined) entity.isActive = domainModel.isActive;
    if (domainModel.sortOrder !== undefined) entity.sortOrder = domainModel.sortOrder;
    if (domainModel.productId !== undefined) entity.productId = domainModel.productId;
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;
    if (domainModel.deletedAt !== undefined) entity.deletedAt = domainModel.deletedAt;

    return entity;
  }
}
