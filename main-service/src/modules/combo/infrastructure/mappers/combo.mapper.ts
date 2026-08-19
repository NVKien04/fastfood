import { CombosEntity } from '@/entities';
import { Combo } from '@/modules/combo/domain/entities/combo.domain';

export class ComboMapper {
  static toDomain(ormEntity: CombosEntity): Combo {
    if (!ormEntity) {
      throw new Error('ComboMapper.toDomain requires an entity');
    }

    return new Combo({
      id: ormEntity.id,
      name: ormEntity.name,
      slug: ormEntity.slug,
      description: ormEntity.description,
      price: ormEntity.price,
      img: ormEntity.img,
      sortOrder: ormEntity.sortOrder,
      isActive: Boolean(ormEntity.isActive),
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
    });
  }

  static toDomainList(ormEntities: CombosEntity[]): Combo[] {
    if (!ormEntities) return [];
    return ormEntities.map((entity) => ComboMapper.toDomain(entity));
  }

  static toOrmEntity(domainModel: Partial<Combo>): Partial<CombosEntity> {
    if (!domainModel) return {};

    const entity: Partial<CombosEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.name !== undefined) entity.name = domainModel.name;
    if (domainModel.slug !== undefined) entity.slug = domainModel.slug;
    if (domainModel.description !== undefined) entity.description = domainModel.description;
    if (domainModel.price !== undefined) entity.price = domainModel.price;
    if (domainModel.img !== undefined) entity.img = domainModel.img;
    if (domainModel.sortOrder !== undefined) entity.sortOrder = domainModel.sortOrder;
    if (domainModel.isActive !== undefined) entity.isActive = domainModel.isActive ? 1 : 0;
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;
    if (domainModel.deletedAt !== undefined) entity.deletedAt = domainModel.deletedAt;

    return entity;
  }
}
