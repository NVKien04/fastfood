import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn, // Thường nên có
  UpdateDateColumn,
  DeleteDateColumn, // Thường nên có
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ProductEntity } from './product.entity';
import { OrdersEntity } from './orders.entity';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'integer',
    nullable: false,
  })
  rating: number;

  @Column({
    type: 'text',
  })
  comment: string;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.id)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user_obj: UserEntity;

  // Quan hệ ManyToOne với Product
  @Column({ type: 'varchar', nullable: false })
  productId: string;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.id)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product_obj: ProductEntity;

  // Quan hệ ManyToOne với Order
  @Column({ type: 'varchar', nullable: false })
  orderId: string;

  @ManyToOne(() => OrdersEntity, (order) => order.id)
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id' })
  order_obj: OrdersEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
