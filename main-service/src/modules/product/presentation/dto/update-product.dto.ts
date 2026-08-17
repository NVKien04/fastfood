import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from '@/modules/product/presentation/dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
