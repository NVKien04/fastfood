import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from '@/modules/category/presentation/dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
