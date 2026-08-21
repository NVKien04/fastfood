import { RoleEnum } from '@/enums';
import { AddressesEntity, NotificationEntity, OrdersEntity, UserCouponsEntity } from '@/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

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

  @Column({ type: 'varchar', name: 'so_dien_thoai', unique: true, nullable: true })
  phone?: string;

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

  @OneToMany(() => OrdersEntity, (order) => order.user_obj)
  orders: OrdersEntity[];

  @OneToMany(() => NotificationEntity, (notification) => notification.user_obj)
  notifications: NotificationEntity[];
}
