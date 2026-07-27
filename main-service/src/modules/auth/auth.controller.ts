import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { Auth } from '#src/common/decorators/auth.decorator';
import { RoleEnum } from '#src/enums/role.enum';
import { JwtAuthGuard } from '#src/guards/jwt.guard';
import { LocalAuthGuard } from '#src/guards/local-auth.guard';
import { AuthService } from '#src/modules/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async Login(@Request() req) {
    const user = req.user;
    return await this.authService.login(user.id, user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Auth(RoleEnum.CUSTOMER)
  @Get('test')
  async Test(@Request() req) {
    console.log(req.user);
    return { data: 'kiên dep trai' };
  }
}
