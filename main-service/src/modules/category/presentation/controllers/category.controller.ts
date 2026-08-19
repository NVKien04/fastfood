import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators';
import { CreateCategoryDto, UpdateCategoryDto } from '@/modules/category/presentation/dto';
import { RoleEnum } from '@/enums';
import { CategoryService } from '@/modules/category/application/services/category.service';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('get-page')
  @ApiOperation({ summary: 'Lấy danh sách danh mục phân trang' })
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  async getPage(@Body() filterObject: Record<string, unknown>) {
    return await this.categoryService.getPage(filterObject);
  }

  @Post()
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới danh mục' })
  @ApiResponse({ status: 201, description: 'Tạo danh mục thành công' })
  @ApiResponse({ status: 409, description: 'Danh mục đã tồn tại' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.create(createCategoryDto);
    return {
      data: category,
      message: 'Tạo danh mục thành công',
    };
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Lấy chi tiết danh mục theo Slug' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Danh mục không tồn tại' })
  async getBySlug(@Param('slug') slug: string) {
    const category = await this.categoryService.getBySlug(slug);
    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    return {
      data: category,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết danh mục theo ID' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Danh mục không tồn tại' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    const category = await this.categoryService.getById(id);
    if (!category) {
      throw new NotFoundException('Danh mục không tồn tại');
    }
    return {
      data: category,
    };
  }

  @Patch(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật danh mục' })
  @ApiResponse({ status: 200, description: 'Cập nhật danh mục thành công' })
  @ApiResponse({ status: 404, description: 'Danh mục không tồn tại' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryService.update(updateCategoryDto, id);
    return {
      data: category,
      message: 'Cập nhật danh mục thành công',
    };
  }

  @Delete(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa danh mục' })
  @ApiResponse({ status: 200, description: 'Xóa danh mục thành công' })
  @ApiResponse({ status: 404, description: 'Danh mục không tồn tại' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.categoryService.delete(id);
    return {
      message: 'Xóa danh mục thành công',
    };
  }
}
