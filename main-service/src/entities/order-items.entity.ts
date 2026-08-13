import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from '@/entities/product.entity';
import { OrdersEntity } from '@/entities/orders.entity';
import { ProductVariantsEntity } from '@/entities/product_variants.entity';
import { OrderItemsIngredientsEntity } from '@/entities/order-item-ingredients.entity';
import { CombosEntity } from '@/entities/combos.entity';

@Entity('order-items')
export class OrderItemsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  productId?: string | null;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.orderItems, { nullable: true })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product_obj?: ProductEntity | null;

  @Column({ type: 'integer', nullable: true })
  productVariantId?: number | null;

  @ManyToOne(() => ProductVariantsEntity, (product_variants) => product_variants.orderItems, { nullable: true })
  @JoinColumn({ name: 'productVariantId', referencedColumnName: 'id' })
  productVariant_obj?: ProductVariantsEntity | null;

  @Column({ type: 'varchar', nullable: true })
  comboId?: string | null;

  @ManyToOne(() => CombosEntity, { nullable: true })
  @JoinColumn({ name: 'comboId', referencedColumnName: 'id' })
  combo_obj?: CombosEntity | null;

  @Column({ type: 'varchar', nullable: false })
  orderId: string;

  @ManyToOne(() => OrdersEntity, (order) => order.orderItems)
  @JoinColumn({ name: 'orderId', referencedColumnName: 'id' })
  order_obj: OrdersEntity;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @Column({ type: 'integer', nullable: true })
  price?: number | null;

  @Column({ type: 'json', nullable: true })
  options?: Record<string, any> | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => OrderItemsIngredientsEntity, (oii) => oii.orderItems_obj)
  orderItemIngredients: OrderItemsIngredientsEntity[];
}
