import { CartItemsEntity, IngredientsEntity } from '@/entities';
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

@Entity('cart_item_ingredients')
export class CartItemIngredientsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  cartItemId: string;

  @ManyToOne(() => CartItemsEntity, (cartItemsEntity) => cartItemsEntity.cartItemIngredients)
  @JoinColumn({ name: 'cartItemId', referencedColumnName: 'id' })
  cartItem_obj: CartItemsEntity;

  @Column({ type: 'integer', nullable: false })
  ingredientId: number;

  @ManyToOne(() => IngredientsEntity, (ingredientsEntity) => ingredientsEntity.cartItemIngredients)
  @JoinColumn({ name: 'ingredientId', referencedColumnName: 'id' })
  ingredient_obj: IngredientsEntity;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
