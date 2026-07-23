import { UpdateUserDto } from '#src/dtos/user/update-user.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { RoleEnum } from 'src/enums/role.enum';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    const user = await this.userService.register(userDto);
    return {
      data: user,
    };
  }
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
  @Patch('update/:id')
  async update(@Body('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(id, updateUserDto);
  }

  // @Auth(RoleEnum.ADMIN)
  @Post('get-page')
  async getPage(@Body() filterObject: any) {
    return await this.userService.getPage(filterObject);
  }
}
