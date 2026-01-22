import { IngredientService } from '#src/services/ingredient.service';
import { ProductService } from '#src/services/product.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { LoginDto } from 'src/dtos/auth/login.dto';
import { RoleEnum } from 'src/enums/role.enum';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from 'src/services/auth.service';
import { CategoryService } from 'src/services/category.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post('get-page')
  async getPage(@Body() filterObject: any) {
    return await this.ingredientService.getPage(filterObject);
  }
}
