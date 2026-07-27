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
import { CategoryEntity } from './category.entity';
import { CartItemIngredientsEntity } from './cart-item-ingredient.entity';
import { ProductIngredientsEntity } from './product_ingredients.entity';
import { OrderItemsIngredientsEntity } from './order-item-ingredients.entity';

@Entity('ingredients')
export class IngredientsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  imageUrl: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ type: 'integer' })
  price: number;

  @Column({ type: 'integer', default: 1 })
  isRequired: number;

  @Column({ type: 'integer', default: 1 })
  isActive: number;

  @Column({ type: 'integer', nullable: false })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.ingredients)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category_obj: CategoryEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => CartItemIngredientsEntity, (cartItemIngredientsEntity) => cartItemIngredientsEntity.ingredient_obj)
  cartItemIngredients: CartItemIngredientsEntity[];

  @OneToMany(() => ProductIngredientsEntity, (product) => product.ingredient_obj)
  productIngredients: ProductIngredientsEntity[];

  @OneToMany(() => OrderItemsIngredientsEntity, (oii) => oii.ingredient_obj)
  orderItemIngredients: OrderItemsIngredientsEntity[];
}
