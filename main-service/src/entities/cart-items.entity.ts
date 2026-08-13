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
import { ProductVariantsEntity } from '@/entities/product_variants.entity';
import { ProductEntity } from '@/entities/product.entity';
import { CartEntity } from '@/entities/cart.entity';
import { CartItemIngredientsEntity } from '@/entities/cart-item-ingredient.entity';
import { CombosEntity } from '@/entities/combos.entity';

@Entity('cart_items')
export class CartItemsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  productId?: string | null;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.cartItems, { nullable: true })
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  product_obj?: ProductEntity | null;

  @Column({ type: 'integer', nullable: true })
  productVariantId?: number | null;

  @ManyToOne(() => ProductVariantsEntity, (product_variants) => product_variants.cartItems, { nullable: true })
  @JoinColumn({ name: 'productVariantId', referencedColumnName: 'id' })
  productVariant_obj?: ProductVariantsEntity | null;

  @Column({ type: 'varchar', nullable: true })
  comboId?: string | null;

  @ManyToOne(() => CombosEntity, { nullable: true })
  @JoinColumn({ name: 'comboId', referencedColumnName: 'id' })
  combo_obj?: CombosEntity | null;

  @Column({ type: 'varchar', nullable: false })
  cartId: string;

  @ManyToOne(() => CartEntity, (cartEntity) => cartEntity.cartItems)
  @JoinColumn({ name: 'cartId', referencedColumnName: 'id' })
  cart_obj: CartEntity;

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

  @OneToMany(() => CartItemIngredientsEntity, (cartItemIngredientsEntity) => cartItemIngredientsEntity.cartItem_obj)
  cartItemIngredients: CartItemIngredientsEntity[];
}
