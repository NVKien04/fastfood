import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { OrdersEntity } from './orders.entity';
import { ProductVariantsEntity } from './product_variants';

@Entity('order-items')
export class OrderItemsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  productId: string;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.id)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product_obj: ProductEntity;

  @Column({ type: 'varchar', nullable: false })
  orderId: string;

  @ManyToOne(() => OrdersEntity, (order) => order.id)
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id' })
  order_obj: OrdersEntity;

  @Column({ type: 'varchar', nullable: false })
  productVariantId: string;

  @ManyToOne(
    () => ProductVariantsEntity,
    (product_variants) => product_variants.id,
  )
  @JoinColumn({ name: 'productVariantId', referencedColumnName: 'id' })
  productVariant_obj: OrdersEntity;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
