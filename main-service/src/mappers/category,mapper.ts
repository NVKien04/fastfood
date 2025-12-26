import { CategoryEntity } from 'src/entities/category.entity';

export class categoryMapper {
  static toResoponse(entity: CategoryEntity) {
    return {
      id: entity.id,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      sortOrder: entity.sortOrder,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  static toResponseList(entities: CategoryEntity[]) {
    return entities.map(this.toResoponse);
  }
}
