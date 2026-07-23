import { SizeEnum } from '#src/enums/size.enum';
import { TypeEnum } from '#src/enums/type.enum';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsString, IsInt, IsOptional, Min, IsEnum } from 'class-validator';

export class CreateProductVariantDto {
  @IsString()
  name: string;

  @IsEnum(SizeEnum)
  size: SizeEnum;

  @IsEnum(TypeEnum)
  type: TypeEnum;

  @IsInt()
  @Min(0)
  modifiedPrice: number;
}

export class CreateProductIngredientDto {
  @IsInt()
  ingredientId: number;

  @IsInt()
  isDefault: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;
}

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @IsNotEmpty()
  @IsString()
  img: string;

  @IsOptional()
  @IsInt()
  isFeatured?: number;

  @IsNotEmpty()
  @IsInt()
  categoryId: number;

  @IsOptional()
  @ApiProperty({ type: [CreateProductVariantDto] })
  variants?: CreateProductVariantDto[];
  @IsOptional()
  @ApiProperty({ type: [CreateProductIngredientDto] })
  ingredients?: CreateProductIngredientDto[];
}
