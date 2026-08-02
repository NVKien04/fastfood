import { RoleEnum } from '#src/enums/role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AddressesEntity } from './addresses.entity';
import { UserCouponsEntity } from './user-coupons.entity';
import { ReviewEntity } from './reviews.entity';
import { OrdersEntity } from './orders.entity';
import { CartEntity } from './cart.entity';
import { NotificationEntity } from './notification.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'so_dien_thoai', unique: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: null,
  })
  role: RoleEnum;

  @Column({ type: 'varchar' })
  provider: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => AddressesEntity, (address) => address.user_obj)
  addresses: AddressesEntity[];

  @OneToMany(() => UserCouponsEntity, (userCoupon) => userCoupon.user_obj)
  userCoupons: UserCouponsEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.user_obj)
  reviews: ReviewEntity[];

  @OneToMany(() => OrdersEntity, (order) => order.user_obj)
  orders: OrdersEntity[];

  @OneToOne(() => CartEntity, (cart) => cart.user_obj)
  cart: CartEntity;

  @OneToMany(() => NotificationEntity, (notification) => notification.user_obj)
  notifications: NotificationEntity[];
}
