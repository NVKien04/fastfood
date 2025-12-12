import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CategoryEntity } from './category.entity';

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

  @Column({ type: 'varchar', nullable: false })
  img: string;

  @Column({ type: 'integer', default: 0 })
  isFeatured: number;

  @Column({ type: 'varchar', nullable: false })
  categoryId: string;

  @ManyToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category_obj: CategoryEntity;

  @Column({ type: 'integer', default: 1 })
  isActive: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp' })
  updatedAt: Date;
}
