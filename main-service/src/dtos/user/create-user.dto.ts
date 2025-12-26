// register-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  IsPhoneNumber,
  Matches,
  IsEnum,
} from 'class-validator';
import { RoleEnum } from 'src/enums/role.enum';
import { IsNull } from 'typeorm';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Email đăng nhập',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd123',
    description: 'Mật khẩu (ít nhất 8 ký tự, có chữ hoa, số)',
  })
  @IsString()
  @Length(8, 50)
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Mật khẩu phải có ít nhất 1 chữ hoa và 1 số',
  })
  password: string;

  @ApiProperty({
    example: 'Nguyễn Văn A',
    description: 'Tên hiển thị',
  })
  @IsString()
  @Length(2, 50)
  name: string;

  @ApiProperty() @IsEnum(RoleEnum) @IsOptional() role?: RoleEnum;

  @ApiProperty({
    example: '0987654321',
    required: false,
    description: 'Số điện thoại (VN)',
  })
  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone?: string;

  @ApiProperty({
    example: 'https://avatar.com/user.png',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty() @IsString() provider: string;
}
