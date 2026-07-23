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
import { CartItemsEntity } from './cart-items.entity';
import { ReviewEntity } from './reviews.entity';
import { ProductVariantsEntity } from './product_variants';
import { ProductIngredientsEntity } from './product_ingredients';
import { OrderItemsEntity } from './order-items.entity';

@Entity('product')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'integer', nullable: false })
  basePrice: number;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ type: 'varchar', nullable: false })
  img: string;

  @Column({ type: 'integer', default: 0 })
  isFeatured: number;

  @Column({ type: 'integer', nullable: false })
  categoryId: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category_obj: CategoryEntity;

  @Column({ type: 'integer', default: 1 })
  isActive: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => CartItemsEntity, (cartItem) => cartItem.product_obj)
  cartItems: CartItemsEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.product_obj)
  reviews: ReviewEntity[];

  @OneToMany(() => ProductVariantsEntity, (product) => product.product_obj)
  productVariants: ProductVariantsEntity[];

  @OneToMany(() => ProductIngredientsEntity, (product) => product.product_obj)
  productIngredients: ProductIngredientsEntity[];

  @OneToMany(() => OrderItemsEntity, (orderItemsEntity) => orderItemsEntity.product_obj)
  orderItems: OrderItemsEntity[];
}
