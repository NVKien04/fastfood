import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators';
import { CreateIngredientDto, UpdateIngredientDto } from '@/modules/ingredient/presentation/dto';
import { RoleEnum } from '@/enums';
import { IngredientService } from '@/modules/ingredient/application/services/ingredient.service';

@ApiTags('Ingredient')
@Controller('ingredient')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post('get-page')
  @ApiOperation({ summary: 'Lấy danh sách nguyên liệu phân trang' })
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  async getPage(@Body() filterObject: Record<string, unknown>) {
    return await this.ingredientService.getPage(filterObject);
  }

  @Post()
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo mới nguyên liệu' })
  @ApiResponse({ status: 201, description: 'Tạo nguyên liệu thành công' })
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    const ingredient = await this.ingredientService.create(createIngredientDto);
    return {
      data: ingredient,
      message: 'Tạo nguyên liệu thành công',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết nguyên liệu theo ID' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công' })
  @ApiResponse({ status: 404, description: 'Nguyên liệu không tồn tại' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    const ingredient = await this.ingredientService.findById(id);
    if (!ingredient) {
      throw new NotFoundException('Nguyên liệu không tồn tại');
    }
    return {
      data: ingredient,
    };
  }

  @Patch(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật nguyên liệu' })
  @ApiResponse({ status: 200, description: 'Cập nhật nguyên liệu thành công' })
  @ApiResponse({ status: 404, description: 'Nguyên liệu không tồn tại' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateIngredientDto: UpdateIngredientDto) {
    const ingredient = await this.ingredientService.update(id, updateIngredientDto);
    return {
      data: ingredient,
      message: 'Cập nhật nguyên liệu thành công',
    };
  }

  @Delete(':id')
  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa nguyên liệu' })
  @ApiResponse({ status: 200, description: 'Xóa nguyên liệu thành công' })
  @ApiResponse({ status: 404, description: 'Nguyên liệu không tồn tại' })
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.ingredientService.delete(id);
    return {
      message: 'Xóa nguyên liệu thành công',
    };
  }
}
