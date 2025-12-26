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
import { IngredientsEntity } from './ingredients.entity';
import { CartItemsEntity } from './cart-items.entity';

@Entity('cart')
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  cartItemId: string;

  @ManyToOne(() => CartItemsEntity, (cartItemsEntity) => cartItemsEntity.id)
  @JoinColumn({ name: 'cartItemId', referencedColumnName: 'id' })
  cardItem_obj: CartItemsEntity;

  @Column({ type: 'varchar', nullable: false })
  ingredientId: string;

  @ManyToOne(
    () => IngredientsEntity,
    (ingredientsEntity) => ingredientsEntity.id,
  )
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
