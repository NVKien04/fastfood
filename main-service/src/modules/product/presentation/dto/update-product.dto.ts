import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from '@/modules/product/presentation/dto/create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
