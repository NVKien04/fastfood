import { UserCouponsEntity } from '@/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('coupons')
export class CouponsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'integer', nullable: false })
  value: number;

  @Column({ type: 'integer', default: 0 })
  minOrderAmount: number;

  @Column({ type: 'integer', default: 1 })
  maxUser: number;

  @Column({ type: 'integer', default: 0 })
  currentUses: number;

  @Column({ type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: false })
  endDate: Date;

  @Column({ type: 'integer', default: 1 })
  isActive: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => UserCouponsEntity, (uc) => uc.coupons_obj)
  userCoupons: UserCouponsEntity[];
}
