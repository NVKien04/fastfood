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
import { CategoryEntity } from './category.entity';

@Entity('ingredients')
export class IngredientsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @Column({ type: 'varchar', nullable: false })
  categoryId: string;

  @ManyToOne(() => CategoryEntity, (category) => category.id)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'id' })
  category_obj: CategoryEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
