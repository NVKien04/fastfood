// response-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { RoleEnum } from '@/enums/role.enum';

@Exclude()
export class UserResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'ID người dùng' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email người dùng' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ và tên' })
  @Expose()
  name: string;

  @ApiPropertyOptional({ example: '0987654321', description: 'Số điện thoại' })
  @Expose()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png', description: 'Ảnh đại diện' })
  @Expose()
  avatar?: string;

  @ApiProperty({ enum: RoleEnum, enumName: 'RoleEnum', example: RoleEnum.CUSTOMER, description: 'Vai trò người dùng' })
  @Expose()
  role: RoleEnum;

  @ApiProperty({ example: 'local', description: 'Phương thức đăng nhập' })
  @Expose()
  provider: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'Thời gian tạo' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', description: 'Thời gian cập nhật gần nhất' })
  @Expose()
  updatedAt: Date;
}
