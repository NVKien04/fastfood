import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '#src/common/decorators/auth.decorator';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { RoleEnum } from '#src/enums/role.enum';
import { AddressService } from '../../application/services/address.service';

interface AuthenticatedRequest {
  user: {
    userId: string;
    role: string;
  };
}

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('get-page')
  @ApiOperation({ summary: 'Lấy danh sách địa chỉ phân trang' })
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  async getPage(@Body() filterObject: any) {
    return await this.addressService.getPage(filterObject);
  }

  @Post()
  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thêm địa chỉ mới' })
  @ApiResponse({ status: 201, description: 'Thêm thành công' })
  async create(@Request() req: AuthenticatedRequest, @Body() createAddressDto: CreateAddressDto) {
    const userId = req.user.userId;
    const address = await this.addressService.create(userId, createAddressDto);
    return {
      data: address,
      message: 'Thêm địa chỉ thành công',
    };
  }

  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @Get('my')
  @ApiOperation({ summary: 'Lấy danh sách địa chỉ của tôi' })
  @ApiResponse({ status: 200, description: 'Lấy dữ liệu thành công' })
  async getMyAddresses(@Request() req: AuthenticatedRequest) {
    const userId = req.user.userId;
    const addresses = await this.addressService.findAllByUserId(userId);
    return {
      data: addresses,
    };
  }

  @Patch(':id')
  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật địa chỉ' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Địa chỉ không tồn tại' })
  async update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    const address = await this.addressService.update(id, updateAddressDto);
    return {
      data: address,
      message: 'Cập nhật địa chỉ thành công',
    };
  }

  @Delete(':id')
  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa địa chỉ' })
  @ApiResponse({ status: 200, description: 'Xóa thành công' })
  @ApiResponse({ status: 404, description: 'Địa chỉ không tồn tại' })
  async delete(@Param('id') id: string) {
    await this.addressService.delete(id);
    return {
      message: 'Xóa địa chỉ thành công',
    };
  }
}
