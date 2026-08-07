import { CouponsEntity } from '#src/entities/coupons.entity';
import { Coupon } from '../../domain/entities/coupon.domain';

export class CouponMapper {
  static toDomain(ormEntity: CouponsEntity): Coupon {
    if (!ormEntity) return null as any;

    return new Coupon({
      id: ormEntity.id,
      code: ormEntity.code,
      name: ormEntity.name,
      description: ormEntity.description,
      value: ormEntity.value,
      minOrderAmount: ormEntity.minOrderAmount,
      maxUser: ormEntity.maxUser,
      currentUses: ormEntity.currentUses,
      startDate: ormEntity.startDate,
      endDate: ormEntity.endDate,
      isActive: Boolean(ormEntity.isActive),
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
    });
  }

  static toDomainList(ormEntities: CouponsEntity[]): Coupon[] {
    if (!ormEntities) return [];
    return ormEntities.map((entity) => CouponMapper.toDomain(entity));
  }

  static toOrmEntity(domainModel: Partial<Coupon>): Partial<CouponsEntity> {
    if (!domainModel) return {};

    const entity: Partial<CouponsEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.code !== undefined) entity.code = domainModel.code;
    if (domainModel.name !== undefined) entity.name = domainModel.name;
    if (domainModel.description !== undefined) entity.description = domainModel.description;
    if (domainModel.value !== undefined) entity.value = domainModel.value;
    if (domainModel.minOrderAmount !== undefined) entity.minOrderAmount = domainModel.minOrderAmount;
    if (domainModel.maxUser !== undefined) entity.maxUser = domainModel.maxUser;
    if (domainModel.currentUses !== undefined) entity.currentUses = domainModel.currentUses;
    if (domainModel.startDate !== undefined) {
      entity.startDate =
        typeof domainModel.startDate === 'string' ? new Date(domainModel.startDate) : domainModel.startDate;
    }
    if (domainModel.endDate !== undefined) {
      entity.endDate = typeof domainModel.endDate === 'string' ? new Date(domainModel.endDate) : domainModel.endDate;
    }
    if (domainModel.isActive !== undefined) {
      entity.isActive =
        typeof domainModel.isActive === 'boolean' ? (domainModel.isActive ? 1 : 0) : domainModel.isActive;
    }
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;
    if (domainModel.deletedAt !== undefined) entity.deletedAt = domainModel.deletedAt;

    return entity;
  }
}
