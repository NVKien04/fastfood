import { UpdateUserDto } from '../dto/update-user.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Request } from '@nestjs/common';
import { Auth } from '#src/common/decorators/auth.decorator';
import { RoleEnum } from '#src/enums/role.enum';
import { UserService } from '../../application/services/user.service';
import { GetUser } from '#src/common/decorators/getUser.decorator';
import type { AuthUser } from '#src/common/constants/auth.constant';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth(RoleEnum.ADMIN)
  @Get('')
  async getAll() {
    const users = await this.userService.getAllUser();
    return {
      data: users,
    };
  }
  @Auth(RoleEnum.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.delete(id);
  }

  @Auth(RoleEnum.CUSTOMER)
  @Patch('update')
  async update(@GetUser() user: AuthUser, @Body() updateUserDto: UpdateUserDto) {
    const id = user.userId;
    return await this.userService.update(id, updateUserDto);
  }

  @Auth(RoleEnum.ADMIN)
  @Post('get-page')
  async getPage(@Body() filterObject: any) {
    return await this.userService.getPage(filterObject);
  }

  @Auth()
  @Get('test-auth-user')
  testAuthUser(@GetUser() user: AuthUser) {
    return {
      message: 'Test AuthUser thành công',
      user,
    };
  }
}
