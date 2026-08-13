import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from '@/entities/product.entity';
import { SizeEnum } from '@/enums/size.enum';
import { TypeEnum } from '@/enums/type.enum';
import { CartItemsEntity } from '@/entities/cart-items.entity';
import { OrderItemsEntity } from '@/entities/order-items.entity';

@Entity('product_variants')
export class ProductVariantsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: SizeEnum,
    default: SizeEnum.SIZE_12,
  })
  size: SizeEnum;

  @Column({
    type: 'enum',
    enum: TypeEnum,
    default: TypeEnum.MEDIUM,
  })
  type: TypeEnum;

  @Column({ type: 'integer', default: 0 })
  modifiedPrice: number;

  @Column({ type: 'integer', default: 1 })
  isActive: number;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ type: 'varchar', nullable: false })
  productId: string;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.productVariants)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product_obj: ProductEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => CartItemsEntity, (cartItem) => cartItem.productVariant_obj)
  cartItems: CartItemsEntity[];

  @OneToMany(() => OrderItemsEntity, (orderItemsEntity) => orderItemsEntity.productVariant_obj)
  orderItems: OrderItemsEntity[];
}
