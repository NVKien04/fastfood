import { CartItemsEntity, UserEntity } from '@/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user_obj: UserEntity;

  @Column({ type: 'integer', nullable: false })
  totalCartPrice: number;

  @Column({ type: 'integer', nullable: false })
  totalItemDiff: number;

  @Column({ type: 'integer', nullable: false })
  totalItems: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => CartItemsEntity, (cartItem) => cartItem.cart_obj)
  cartItems: CartItemsEntity[];
}
