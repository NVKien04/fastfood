import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'OldPassword123!',
    description: 'Mật khẩu cũ',
  })
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu cũ' })
  oldPassword: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description: 'Mật khẩu mới',
  })
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu mới' })
  @MinLength(6, { message: 'Mật khẩu mới phải có tối thiểu 6 ký tự' })
  newPassword: string;
}
