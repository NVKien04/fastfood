import { RoleEnum } from 'src/enums/role.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // UUID phải là string

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'so_dien_thoai' })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: null,
  })
  role: RoleEnum;

  @Column({ type: 'varchar' })
  provider: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'update_at', type: 'timestamp' })
  updatedAt: Date;
}
