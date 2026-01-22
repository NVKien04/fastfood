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
import { ProductVariantsEntity } from './product_variants';
import { ProductEntity } from './product.entity';
import { CartEntity } from './cart.entity';
import { CartItemIngredientsEntity } from './cart-item-ingredient.entity';

@Entity('cart_items')
export class CartItemsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  productId: string;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.cartItems)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product_obj: ProductEntity;

  @Column({ type: 'varchar', nullable: false })
  productVariantId: string;

  @ManyToOne(
    () => ProductVariantsEntity,
    (product_variants) => product_variants.cartItems,
  )
  @JoinColumn({ name: 'productVariantId', referencedColumnName: 'id' })
  productVariant_obj: ProductVariantsEntity;

  @Column({ type: 'varchar', nullable: false })
  cartId: string;

  @ManyToOne(() => CartEntity, (cartEntity) => cartEntity.cartItems)
  @JoinColumn({ name: 'cartId', referencedColumnName: 'id' })
  cart_obj: CartEntity;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(
    () => CartItemIngredientsEntity,
    (cartItemIngredientsEntity) => cartItemIngredientsEntity.cartItem_obj,
  )
  cartItemIngredients: CartItemIngredientsEntity[];
}
