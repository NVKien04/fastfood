import { OrderStatus } from '#src/enums/order-status.enum.ts';
import { PaymentMethod } from '#src/enums/payment-method.enum';
import { PaymentStatus } from '#src/enums/payment-status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AddressesEntity } from './addresses.entity';
import { ReviewEntity } from './reviews.entity';
import { OrderItemsEntity } from './order-items.entity';

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  orderNumber: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'integer' })
  subTotal: number;

  @Column({ type: 'integer' })
  deliveryFee: number;

  @Column({ type: 'integer' })
  discount: number;

  @Column({ type: 'integer' })
  total: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', nullable: true })
  userId?: string | null;

  @ManyToOne(() => UserEntity, (user) => user.orders, { nullable: true })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user_obj?: UserEntity | null;

  @Column({ type: 'varchar', nullable: true })
  addressId?: string | null;

  @ManyToOne(() => AddressesEntity, (addressesEntity) => addressesEntity.orders, { nullable: true })
  @JoinColumn({ name: 'addressId', referencedColumnName: 'id' })
  address_obj?: AddressesEntity | null;

  @Column({ type: 'varchar', nullable: true })
  guestName?: string | null;

  @Column({ type: 'varchar', nullable: true })
  guestPhone?: string | null;

  @Column({ type: 'varchar', nullable: true })
  guestEmail?: string | null;

  @Column({ type: 'text', nullable: true })
  guestAddress?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToOne(() => ReviewEntity, (review) => review.order)
  review: ReviewEntity;

  @OneToMany(() => OrderItemsEntity, (orderItemsEntity) => orderItemsEntity.order_obj)
  orderItems: OrderItemsEntity[];
}
