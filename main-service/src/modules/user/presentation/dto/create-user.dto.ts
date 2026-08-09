// create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length, IsPhoneNumber, Matches, IsEnum } from 'class-validator';
import { RoleEnum } from '@/enums/role.enum';

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

  @ApiPropertyOptional({
    enum: RoleEnum,
    enumName: 'RoleEnum',
    example: RoleEnum.CUSTOMER,
    description: 'Vai trò người dùng',
  })
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;

  @ApiPropertyOptional({
    example: '0987654321',
    description: 'Số điện thoại (VN)',
  })
  @IsOptional()
  @IsPhoneNumber('VN', { message: 'Số điện thoại không hợp lệ' })
  phone?: string;

  @ApiPropertyOptional({
    example: 'https://avatar.com/user.png',
    description: 'URL ảnh đại diện',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({
    example: 'local',
    description: 'Phương thức đăng ký/đăng nhập (local, google, facebook)',
  })
  @IsString()
  provider: string;
}
