// create-user.dto.ts
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  IsPhoneNumber,
} from 'class-validator';
import { RoleEnum } from 'src/enums/role.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 50)
  password: string;

  @IsString()
  @Length(2, 50)
  name: string;

  @IsString()
  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;

  @IsString()
  provider: string;
}
