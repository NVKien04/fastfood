import { Controller, Post, Request, UseGuards } from '@nestjs/common';
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
}
