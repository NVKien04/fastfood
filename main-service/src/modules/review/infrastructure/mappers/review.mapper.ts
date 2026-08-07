import { ReviewEntity } from '#src/entities/reviews.entity';
import { Review } from '../../domain/entities/review.domain';

export class ReviewMapper {
  static toDomain(ormEntity: ReviewEntity): Review {
    if (!ormEntity) return null as any;

    return new Review({
      id: ormEntity.id,
      rating: ormEntity.rating,
      comment: ormEntity.comment,
      userId: ormEntity.userId,
      productId: ormEntity.productId,
      orderId: ormEntity.orderId,
      createdAt: ormEntity.createdAt,
      updatedAt: ormEntity.updatedAt,
      deletedAt: ormEntity.deletedAt,
    });
  }

  static toDomainList(ormEntities: ReviewEntity[]): Review[] {
    if (!ormEntities) return [];
    return ormEntities.map((entity) => ReviewMapper.toDomain(entity));
  }

  static toOrmEntity(domainModel: Partial<Review>): Partial<ReviewEntity> {
    if (!domainModel) return {};

    const entity: Partial<ReviewEntity> = {};

    if (domainModel.id !== undefined) entity.id = domainModel.id;
    if (domainModel.rating !== undefined) entity.rating = domainModel.rating;
    if (domainModel.comment !== undefined) entity.comment = domainModel.comment;
    if (domainModel.userId !== undefined) entity.userId = domainModel.userId;
    if (domainModel.productId !== undefined) entity.productId = domainModel.productId;
    if (domainModel.orderId !== undefined) entity.orderId = domainModel.orderId;
    if (domainModel.createdAt !== undefined) entity.createdAt = domainModel.createdAt;
    if (domainModel.updatedAt !== undefined) entity.updatedAt = domainModel.updatedAt;
    if (domainModel.deletedAt !== undefined) entity.deletedAt = domainModel.deletedAt;

    return entity;
  }
}
