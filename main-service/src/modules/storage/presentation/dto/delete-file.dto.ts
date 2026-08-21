import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteFileDto {
  @ApiProperty({
    description: 'S3 Key (vd: avatars/17123.jpg) hoặc URL đầy đủ của file cần xóa',
    example: 'avatars/1787325480204.png',
  })
  @IsString()
  @IsNotEmpty()
  keyOrUrl: string;
}
