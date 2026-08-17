import { UpdateUserDto } from '@/modules/user/presentation/dto/update-user.dto';
import { UserFilterDto } from '@/modules/user/presentation/dto/user-filter.dto';
import { UserResponseDto } from '@/modules/user/presentation/dto/response-user.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '@/common/decorators/auth.decorator';
import { RoleEnum } from '@/enums/role.enum';
import { UserService } from '@/modules/user/application/services/user.service';
import { AddressService } from '@/modules/address/application/services/address.service';
import { GetUser } from '@/common/decorators/getUser.decorator';
import type { AuthUser } from '@/modules/auth/domain/interface/auth.interface';
import { CreateAddressDto } from '@/modules/address/presentation/dto/create-address.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly addressService: AddressService,
  ) {}

  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'Lấy tất cả danh sách người dùng (Admin)' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách người dùng thành công', type: [UserResponseDto] })
  async getAll() {
    return await this.userService.getAllUser();
  }

  @Auth()
  @ApiBearerAuth()
  @Get('info')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân người dùng đang đăng nhập' })
  @ApiResponse({ status: 200, description: 'Lấy thông tin cá nhân thành công', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  async getInfo(@GetUser() user: AuthUser) {
    return await this.userService.getInfo(user.userId);
  }

  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của người dùng', type: String })
  @ApiResponse({ status: 200, description: 'Lấy thông tin thành công', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async getById(@Param('id') id: string) {
    return await this.userService.getInfo(id);
  }

  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @Delete(':id')
  @ApiOperation({ summary: 'Xóa người dùng theo ID (Admin)' })
  @ApiParam({ name: 'id', description: 'ID của người dùng', type: String })
  @ApiResponse({ status: 200, description: 'Xóa người dùng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }

  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @Patch('update')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  @ApiResponse({ status: 200, description: 'Cập nhật thành công', type: UserResponseDto })
  async update(@GetUser() user: AuthUser, @Body() updateUserDto: UpdateUserDto) {
    const id = user.userId;
    return await this.userService.update(id, updateUserDto);
  }

  @Auth(RoleEnum.CUSTOMER, RoleEnum.ADMIN)
  @ApiBearerAuth()
  @Post('address')
  @ApiOperation({ summary: 'Thêm địa chỉ giao hàng cho người dùng' })
  @ApiResponse({ status: 201, description: 'Thêm địa chỉ giao hàng thành công' })
  async addAddress(@GetUser() user: AuthUser, @Body() createAddressDto: CreateAddressDto) {
    const address = await this.addressService.create(user.userId, createAddressDto);
    return {
      data: address,
      message: 'Thêm địa chỉ giao hàng thành công',
    };
  }

  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @Post('get-page')
  @ApiOperation({ summary: 'Lấy danh sách người dùng phân trang (Admin)' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách phân trang thành công', type: [UserResponseDto] })
  async getPage(@Body() filterObject: UserFilterDto) {
    return await this.userService.getPage(filterObject);
  }
}
