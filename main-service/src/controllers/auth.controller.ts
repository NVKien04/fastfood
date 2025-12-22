import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LoginDto } from 'src/dtos/auth/login.dto';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async Login(@Request() req) {
    return await this.authService.login(req.id, req.role);
  }
}
