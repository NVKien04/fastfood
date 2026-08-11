import { ProductService } from '../../application/services/product.service';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '#src/common/decorators/auth.decorator';
import { RoleEnum } from '#src/enums/role.enum';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductDetailResponseDto } from '../dto/product-detail-response.dto';
import { ProductFilterDto } from '../dto/product-filter.dto';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('get-page')
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm phân trang' })
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  async getPage(@Body() filterObject: ProductFilterDto) {
    return await this.productService.getPage(filterObject);
  }

  @Post()
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới sản phẩm kèm biến thể và thành phần' })
  @ApiResponse({ status: 201, description: 'Tạo sản phẩm thành công' })
  @ApiResponse({ status: 409, description: 'Sản phẩm đã tồn tại' })
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productService.create(createProductDto);
    return {
      data: product,
      message: 'Tạo sản phẩm thành công',
    };
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm theo Slug (kèm biến thể và nguyên liệu)' })
  @ApiParam({ name: 'slug', description: 'Slug SEO của sản phẩm', type: String, example: 'pizza-hai-san' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công', type: ProductDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Sản phẩm không tồn tại' })
  async getBySlug(@Param('slug') slug: string) {
    const product = await this.productService.getDetailBySlug(slug);
    return {
      data: product,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm theo ID (kèm biến thể và nguyên liệu)' })
  @ApiParam({ name: 'id', description: 'UUID của sản phẩm', type: String })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công', type: ProductDetailResponseDto })
  @ApiResponse({ status: 404, description: 'Sản phẩm không tồn tại' })
  async getById(@Param('id') id: string) {
    const product = await this.productService.getDetail(id);
    return {
      data: product,
    };
  }

  @Patch(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật sản phẩm, biến thể và thành phần' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm', type: String })
  @ApiResponse({ status: 200, description: 'Cập nhật sản phẩm thành công' })
  @ApiResponse({ status: 404, description: 'Sản phẩm không tồn tại' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const product = await this.productService.update(id, updateProductDto);
    return {
      data: product,
      message: 'Cập nhật sản phẩm thành công',
    };
  }

  @Delete(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa sản phẩm theo ID' })
  @ApiParam({ name: 'id', description: 'ID của sản phẩm', type: String })
  @ApiResponse({ status: 200, description: 'Xóa sản phẩm thành công' })
  @ApiResponse({ status: 404, description: 'Sản phẩm không tồn tại' })
  async delete(@Param('id') id: string) {
    await this.productService.delete(id);
    return {
      message: 'Xóa sản phẩm thành công',
    };
  }
}
