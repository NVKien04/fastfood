// update-user.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/user/presentation/dto/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
