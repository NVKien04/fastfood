// user-response.dto.ts
import { Expose } from 'class-transformer';
import { RoleEnum } from 'src/enums/role.enum';

export class UserResponseDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
  @Expose()
  name: string;
  @Expose()
  phone: string;
  @Expose()
  avatar: string;
  @Expose()
  role: RoleEnum;
  @Expose()
  provider: string;
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
