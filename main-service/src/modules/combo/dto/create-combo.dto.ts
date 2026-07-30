import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateComboGroupDto {
  @IsNotEmpty()
  @IsString()
  groupName: string;

  @IsNumber()
  @IsOptional()
  quantityAllowed?: number;
}

export class CreateComboDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsString()
  img: string;

  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @IsOptional()
  @IsArray()
  groups?: CreateComboGroupDto[];
}
