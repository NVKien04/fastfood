import { ProductIngredientsEntity } from '@/entities/product_ingredients.entity';
import { ProductIngredient } from '@/modules/product-ingredient/domain/entities/product-ingredient.domain';

export class ProductIngredientMapper {
  static toDomain(ormEntity: ProductIngredientsEntity | null): ProductIngredient | null {
    if (!ormEntity) return null;

    return new ProductIngredient({
      id: ormEntity.id,
      productId: ormEntity.productId,
      ingredientId: ormEntity.ingredientId,
      isDefault: ormEntity.isDefault,
      quantity: ormEntity.quantity,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
    });
  }

  static toDomainList(ormEntities: ProductIngredientsEntity[]): ProductIngredient[] {
    if (!ormEntities) return [];
    return ormEntities
      .map((entity) => ProductIngredientMapper.toDomain(entity))
      .filter((item): item is ProductIngredient => item !== null);
  }

  static toOrmEntity(domainModel: Partial<ProductIngredient>): Partial<ProductIngredientsEntity> {
    if (!domainModel) return {};

    const entity: Partial<ProductIngredientsEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.productId !== undefined) entity.productId = domainModel.productId;
    if (domainModel.ingredientId !== undefined) entity.ingredientId = domainModel.ingredientId;
    if (domainModel.isDefault !== undefined) entity.isDefault = domainModel.isDefault;
    if (domainModel.quantity !== undefined) entity.quantity = domainModel.quantity;
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;
    if (domainModel.deletedAt !== undefined) entity.deletedAt = domainModel.deletedAt;

    return entity;
  }
}
