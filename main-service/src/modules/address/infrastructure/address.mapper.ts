import { AddressesEntity } from '#src/entities/addresses.entity';
import { Address } from '../domain/address.domain';

export class AddressMapper {
  static toDomain(ormEntity: AddressesEntity): Address {
    if (!ormEntity) return null as any;

    return new Address({
      id: ormEntity.id,
      street: ormEntity.street,
      city: ormEntity.city,
      district: ormEntity.district,
      ward: ormEntity.ward,
      longitude: ormEntity.longitude,
      latitude: ormEntity.latitude,
      isDefault: ormEntity.isDefault,
      userId: ormEntity.userId,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
    });
  }

  static toDomainList(ormEntities: AddressesEntity[]): Address[] {
    if (!ormEntities) return [];
    return ormEntities.map((entity) => AddressMapper.toDomain(entity));
  }

  static toOrmEntity(domainModel: Partial<Address>): Partial<AddressesEntity> {
    if (!domainModel) return {};

    const entity: Partial<AddressesEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.street !== undefined) entity.street = domainModel.street;
    if (domainModel.city !== undefined) entity.city = domainModel.city;
    if (domainModel.district !== undefined) entity.district = domainModel.district;
    if (domainModel.ward !== undefined) entity.ward = domainModel.ward;
    if (domainModel.longitude !== undefined) entity.longitude = domainModel.longitude;
    if (domainModel.latitude !== undefined) entity.latitude = domainModel.latitude;
    if (domainModel.isDefault !== undefined) entity.isDefault = domainModel.isDefault;
    if (domainModel.userId !== undefined) entity.userId = domainModel.userId;
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;
    if (domainModel.deletedAt !== undefined) entity.deletedAt = domainModel.deletedAt;

    return entity;
  }
}
