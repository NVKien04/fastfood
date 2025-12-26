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
import { IngredientsEntity } from './ingredients.entity';
import { ProductIngredientsEntity } from './product_ingredients';
import { OrderItemsEntity } from './order-items.entity';

@Entity('order-items-ingredients')
export class OrderItemsIngredientsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  ingredientId: string;

  @ManyToOne(
    () => IngredientsEntity,
    (ingredientsEntity) => ingredientsEntity.id,
  )
  @JoinColumn({ name: 'ingredientId', referencedColumnName: 'id' })
  ingredient_obj: IngredientsEntity;
  orderId: string;

  @Column({ type: 'varchar', nullable: false })
  orderItem: string;

  @ManyToOne(() => OrderItemsEntity, (orderItemsEntity) => orderItemsEntity.id)
  @JoinColumn({ name: 'orderItem', referencedColumnName: 'id' })
  porderItems_obj: OrderItemsEntity;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
