import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFileRequestDto {
  @ApiProperty({ description: 'URL hoặc Key của file trên S3', example: 'products/1723456789-abc.jpg' })
  @IsString()
  @IsNotEmpty()
  fileUrlOrKey: string;
}
