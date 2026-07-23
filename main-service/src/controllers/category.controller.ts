import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from 'src/services/category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('get-page')
  async getPage(@Body() filterObject: any) {
    return await this.categoryService.getPage(filterObject);
  }
}
