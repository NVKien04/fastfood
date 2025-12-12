import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('addresses')
export class AddressesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  street: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  district: string;

  @Column({ type: 'varchar' })
  ward: string;

  @Column({ type: 'float', nullable: false })
  longtitude: number;

  @Column({ type: 'float', nullable: false })
  latitude: number;

  @Column({ type: 'integer', default: 1 })
  isDefault: number;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @OneToMany(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user_obj: UserEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp' })
  updatedAt: Date;
}
