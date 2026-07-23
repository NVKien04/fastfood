import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CouponsEntity } from './coupons.entity';

@Index(['userId', 'couponsId'], { unique: true })
@Entity('user_coupons')
export class UserCouponsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'integer', default: 0 })
  isUsed: number;

  @Column({ name: 'user_at', type: 'timestamp', nullable: true })
  userdAt: Date | null;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.userCoupons)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user_obj: UserEntity;

  @Column({ type: 'varchar', nullable: false })
  couponsId: string;

  @ManyToOne(() => CouponsEntity, (couponsEntity) => couponsEntity.userCoupons)
  @JoinColumn({ name: 'couponsId', referencedColumnName: 'id' })
  coupons_obj: CouponsEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
