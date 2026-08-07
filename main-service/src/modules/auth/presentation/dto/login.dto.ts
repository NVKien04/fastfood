import { IsEmail, IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'user@gmail.com',
    description: 'Email đăng nhập',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd123',
    description: 'Mật khẩu (ít nhất 8 ký tự, có chữ hoa, số)',
  })
  @IsString()
  @Length(8, 50)
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'Mật khẩu phải có ít nhất 1 chữ hoa và 1 số',
  })
  password: string;
}
