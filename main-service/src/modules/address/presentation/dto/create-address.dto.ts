import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAddressDto {
  @ApiProperty({ description: 'Tên đường, số nhà', example: '123 Đường Nguyễn Trãi' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'Thành phố / Tỉnh', example: 'Hà Nội' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'Quận / Huyện', example: 'Thanh Xuân' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiPropertyOptional({ description: 'Phường / Xã', example: 'Khương Trung' })
  @IsString()
  @IsOptional()
  ward?: string;

  @ApiPropertyOptional({ description: 'Đặt làm địa chỉ mặc định không? (0: không, 1: có)', example: 1, default: 1 })
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(1)
  isDefault?: number;
}
