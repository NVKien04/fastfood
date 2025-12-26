import { Body, Controller, Get, Post } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { RoleEnum } from 'src/enums/role.enum';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  CreateUserDemo(@Body() userDto: CreateUserDto) {
    const user = this.userService.register(userDto);
    return {
      data: user,
    };
  }

  @Auth(RoleEnum.ADMIN)
  @Get('')
  getAllUser() {
    const users = this.userService.getAllUser();
    return {
      data: users,
    };
  }

  @Auth(RoleEnum.ADMIN)
  @Post('get-page')
  getPage(@Body() filterObject: any) {
    return this.userService.getPage(filterObject);
  }
}
