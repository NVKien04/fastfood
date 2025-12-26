import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ProductVariantsEntity } from './product_variants';
import { OrdersEntity } from './orders.entity';
import { ProductEntity } from './product.entity';
import { CartsEntity } from './carts.entity';

@Entity('cart_items')
export class CartItemsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  productId: string;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.id)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product_obj: ProductEntity;

  @Column({ type: 'varchar', nullable: false })
  productVariantId: string;

  @ManyToOne(
    () => ProductVariantsEntity,
    (product_variants) => product_variants.id,
  )
  @JoinColumn({ name: 'productVariantId', referencedColumnName: 'id' })
  productVariant_obj: OrdersEntity;

  @Column({ type: 'varchar', nullable: false })
  cartsId: string;

  @ManyToOne(() => CartsEntity, (cartsEntity) => cartsEntity.id)
  @JoinColumn({ name: 'cartsId', referencedColumnName: 'id' })
  carts_obj: OrdersEntity;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
