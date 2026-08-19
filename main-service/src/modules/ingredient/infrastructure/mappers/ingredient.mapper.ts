import { IngredientsEntity } from '@/entities';
import { Ingredient } from '@/modules/ingredient/domain/entities/ingredient.domain';

export class IngredientMapper {
  static toDomain(ormEntity: IngredientsEntity): Ingredient {
    if (!ormEntity) {
      throw new Error('IngredientMapper.toDomain requires an entity');
    }

    return new Ingredient({
      id: ormEntity.id,
      name: ormEntity.name,
      imageUrl: ormEntity.imageUrl,
      description: ormEntity.description,
      sortOrder: ormEntity.sortOrder,
      price: ormEntity.price,
      isRequired: Boolean(ormEntity.isRequired),
      isActive: Boolean(ormEntity.isActive),
      categoryId: ormEntity.categoryId,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
    });
  }

  static toDomainList(ormEntities: IngredientsEntity[]): Ingredient[] {
    if (!ormEntities) return [];
    return ormEntities.map((entity) => IngredientMapper.toDomain(entity));
  }

  static toOrmEntity(domainModel: Partial<Ingredient>): Partial<IngredientsEntity> {
    if (!domainModel) return {};

    const entity: Partial<IngredientsEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.name !== undefined) entity.name = domainModel.name;
    if (domainModel.imageUrl !== undefined) entity.imageUrl = domainModel.imageUrl;
    if (domainModel.description !== undefined) entity.description = domainModel.description;
    if (domainModel.sortOrder !== undefined) entity.sortOrder = domainModel.sortOrder;
    if (domainModel.price !== undefined) entity.price = domainModel.price;
    if (domainModel.isRequired !== undefined) {
      entity.isRequired =
        typeof domainModel.isRequired === 'boolean' ? (domainModel.isRequired ? 1 : 0) : domainModel.isRequired;
    }
    if (domainModel.isActive !== undefined) {
      entity.isActive =
        typeof domainModel.isActive === 'boolean' ? (domainModel.isActive ? 1 : 0) : domainModel.isActive;
    }
    if (domainModel.categoryId !== undefined) entity.categoryId = domainModel.categoryId;
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;
    if (domainModel.deletedAt !== undefined) entity.deletedAt = domainModel.deletedAt;

    return entity;
  }
}
