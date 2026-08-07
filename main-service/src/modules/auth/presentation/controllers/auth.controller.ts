import { Body, Controller, Post, Request, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../application/services/auth.service';
import { type Response } from 'express';
import { CookieName } from '#src/common/constants/auth.constant';
import { LoginDto } from '../dto/login.dto';
import { CreateUserDto } from '#src/modules/user/presentation/dto/create-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { Auth } from '#src/common/decorators/auth.decorator';
import { RoleEnum } from '#src/enums/role.enum';

@Controller('auth')
export class AuthController {
  private readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

  constructor(private readonly authService: AuthService) {}

  private createCookie(res: Response, cookieName: CookieName, cookiePayload: string, maxAge: number) {
    res.cookie(cookieName, cookiePayload, {
      maxAge,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  private clearCookie(cookieName: CookieName, res: Response) {
    res.clearCookie(cookieName, {
      path: '/',
      sameSite: 'lax',
      httpOnly: true,
    });
  }

  private setAuthCookie(res: Response, refreshToken: string) {
    const maxAgeRefreshToken = Number(this.JWT_REFRESH_EXPIRES_IN?.slice(0, -1)) * 60 * 1000 || 7 * 24 * 60 * 60 * 1000;
    this.createCookie(res, 'refreshToken', refreshToken, maxAgeRefreshToken);
  }

  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    const user = await this.authService.register(userDto);
    return {
      data: user,
    };
  }

  @Post('login')
  async Login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(data);
    this.setAuthCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  async Logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refreshToken'];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    this.clearCookie('refreshToken', res);
    return { message: 'Logout successful' };
  }

  @Post('refresh')
  async refresh(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('Không tìm thấy Refresh Token');
    }
    const tokens = await this.authService.refresh(refreshToken);
    this.setAuthCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Auth()
  @Post('change-password')
  async changePassword(@Request() req: any, @Body() data: ChangePasswordDto) {
    const userId = req.user.userId;
    await this.authService.changePassword(userId, data);
    return { message: 'Thay đổi mật khẩu thành công' };
  }

  @Auth(RoleEnum.CUSTOMER)
  @Post('test-customer')
  testCustomer(@Request() req: any) {
    return {
      message: 'Truy cập role CUSTOMER thành công',
      user: req.user,
    };
  }

  @Auth(RoleEnum.ADMIN)
  @Post('test-admin')
  testAdmin(@Request() req: any) {
    return {
      message: 'Truy cập role ADMIN thành công',
      user: req.user,
    };
  }
}
