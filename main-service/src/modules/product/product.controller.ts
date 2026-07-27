import { ProductService } from '#src/modules/product/product.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('get-page')
  async getPage(@Body() filterObject: any) {
    return await this.productService.getPage(filterObject);
  }
}
