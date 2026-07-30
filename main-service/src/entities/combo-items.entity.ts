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
import { CombosEntity } from './combos.entity';

@Entity('combo_items')
export class ComboItemsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  comboId: string;

  @ManyToOne(() => CombosEntity, (combo) => combo.comboItems)
  @JoinColumn({ name: 'comboId', referencedColumnName: 'id' })
  combo_obj: CombosEntity;

  @Column({ type: 'varchar', nullable: false })
  groupName: string;

  @Column({ type: 'integer', default: 1 })
  quantityAllowed: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
