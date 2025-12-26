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
import { SizeEnum } from 'src/enums/size.enum';
import { TypeEnum } from 'src/enums/type.enum';

@Entity('product_variants')
export class ProductVariantsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({
    type: 'enum',
    enum: SizeEnum,
    default: SizeEnum.SIZE_12,
  })
  size: SizeEnum;

  @Column({
    type: 'enum',
    enum: TypeEnum,
    default: TypeEnum.NORMAL,
  })
  type: TypeEnum;

  @Column({ type: 'integer', default: 0 })
  modifiedPrice: number;

  @Column({ type: 'integer', default: 1 })
  isActive: number;

  @Column({ type: 'integer', default: 0 })
  sortOrder: number;

  @Column({ type: 'varchar', nullable: false })
  productId: string;

  @ManyToOne(() => ProductEntity, (productEntity) => productEntity.id)
  @JoinColumn({ name: 'productId', referencedColumnName: 'id' })
  productVariant_obj: ProductEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
