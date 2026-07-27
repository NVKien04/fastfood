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
import { ProductEntity } from './product.entity';
import { IngredientsEntity } from './ingredients.entity';

@Entity('product_ingredients')
export class ProductIngredientsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  productId: string;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.productIngredients)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product_obj: ProductEntity;

  @Column({ type: 'integer', nullable: false })
  ingredientId: number;

  @ManyToOne(() => IngredientsEntity, (ingredientsEntity) => ingredientsEntity.productIngredients)
  @JoinColumn({ name: 'ingredientId', referencedColumnName: 'id' })
  ingredient_obj: IngredientsEntity;

  @Column({ type: 'integer', nullable: false })
  isDefault: number;

  @Column({ type: 'integer', nullable: true })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
