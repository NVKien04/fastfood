import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from '@/modules/user/presentation/dto';
// update-user.dto.ts

export class UpdateUserDto extends PartialType(CreateUserDto) {}
