import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async CreateUserDemo(@Body() userDto: CreateUserDto) {
    const user = await this.userService.register(userDto);
    return {
      data: user,
    };
  }

  @Get('')
  async getAllUser() {
    const users = await this.userService.getAllUser();
    return {
      users,
    };
  }
}
