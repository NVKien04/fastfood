// user-response.dto.ts
import { RoleEnum } from 'src/enums/role.enum';

export class UserResponseDto {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  role: RoleEnum;
  provider: string;
  createdAt: Date;
  updatedAt: Date;
}
