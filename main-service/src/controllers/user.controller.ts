import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/user/create-user.dto';
import { UserService } from 'src/services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async CreateUserDemo(@Body() userDto: CreateUserDto) {
    const user = await this.userService.createUserDemo(userDto);
    return {
      data: user,
    };
  }
}
