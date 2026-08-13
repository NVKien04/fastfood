import { PartialType } from '@nestjs/swagger';
import { CreateIngredientDto } from '@/modules/ingredient/presentation/dto/create-ingredient.dto';

export class UpdateIngredientDto extends PartialType(CreateIngredientDto) {}
