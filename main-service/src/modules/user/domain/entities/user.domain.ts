import { RoleEnum } from '@/enums/role.enum';

export class User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  avatar?: string;
  role: RoleEnum;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
