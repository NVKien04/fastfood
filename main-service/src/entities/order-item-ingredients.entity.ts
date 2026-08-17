import { IngredientsEntity, OrderItemsEntity } from '@/entities';
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

@Entity('order-items-ingredients')
export class OrderItemsIngredientsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', nullable: false })
  ingredientId: number;

  @ManyToOne(() => IngredientsEntity, (ingredientsEntity) => ingredientsEntity.orderItemIngredients)
  @JoinColumn({ name: 'ingredientId', referencedColumnName: 'id' })
  ingredient_obj: IngredientsEntity;

  @Column({ type: 'varchar', nullable: false })
  orderItemId: string;

  @ManyToOne(() => OrderItemsEntity, (orderItemsEntity) => orderItemsEntity.orderItemIngredients)
  @JoinColumn({ name: 'orderItemId', referencedColumnName: 'id' })
  orderItems_obj: OrderItemsEntity;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
