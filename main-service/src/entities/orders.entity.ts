import { OrderStatus } from 'src/enums/order-status.enum.ts';
import { PaymentMethod } from 'src/enums/payment-method.enum';
import { PaymentStatus } from 'src/enums/payment-status.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AddressesEntity } from './addresses.entity';

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

  // paymentMethod (PaymentMethod E)
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true, // Thường paymentMethod có thể null nếu thanh toán chưa được chọn
  })
  paymentMethod: PaymentMethod;

  @Column({ type: 'integer' })
  subTotal: number;

  // deliveryFee (integer)
  @Column({ type: 'integer' })
  deliveryFee: number;

  // discount (integer)
  @Column({ type: 'integer' })
  discount: number;

  // total (integer)
  @Column({ type: 'integer' })
  total: number;

  // notes (text)
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @OneToMany(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user_obj: UserEntity;

  @Column({ type: 'varchar', nullable: false })
  addressId: string;

  @OneToMany(() => AddressesEntity, (addressesEntity) => addressesEntity.id)
  @JoinColumn({ name: 'addressId', referencedColumnName: 'id' })
  address_obj: AddressesEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
