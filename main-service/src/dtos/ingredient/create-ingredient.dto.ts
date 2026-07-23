import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @IsOptional()
  isRequired?: number; // 0 | 1

  @IsInt()
  @IsOptional()
  isActive?: number; // 0 | 1

  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
