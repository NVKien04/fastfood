import { Body, Controller, Post, Request, Res, UnauthorizedException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { type Response } from 'express';
import { type CookieName } from '@/modules/auth/domain/interface/auth.interface';
import { ChangePasswordDto, LoginDto, LoginResponseDto } from '@/modules/auth/presentation/dto';
import { CreateUserDto, UserResponseDto } from '@/modules/user/presentation/dto';
import { Auth } from '@/common/decorators';
import { RoleEnum } from '@/enums';
import ms, { StringValue } from 'ms';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private createCookie(res: Response, cookieName: CookieName, cookiePayload: string, maxAge: number) {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie(cookieName, cookiePayload, {
      maxAge,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
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
    const jwtRefreshExpiresIn = this.configService.get<StringValue>('JWT_REFRESH_EXPIRES_IN', '7d');
    const maxAgeRefreshToken = ms(jwtRefreshExpiresIn) || 7 * 24 * 60 * 60 * 1000;
    this.createCookie(res, 'refreshToken', refreshToken, maxAgeRefreshToken);
    this.setLoggedInCookie(res, maxAgeRefreshToken);
  }

  private setLoggedInCookie(res: Response, maxAge: number) {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    res.cookie('logged_in', 'true', {
      maxAge,
      path: '/',
      httpOnly: false,
      sameSite: 'lax',
      secure: isProduction,
    });
  }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  @ApiResponse({ status: 201, description: 'Đăng ký thành công', type: UserResponseDto })
  async register(@Body() userDto: CreateUserDto) {
    const user = await this.authService.register(userDto);
    return {
      data: user,
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  @ApiResponse({ status: 200, description: 'Đăng nhập thành công', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Email hoặc mật khẩu không chính xác' })
  async Login(@Body() data: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(data);
    this.setAuthCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất hệ thống' })
  @ApiResponse({ status: 200, description: 'Đăng xuất thành công' })
  async Logout(@Request() req: any, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.['refreshToken'];
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    this.clearCookie('refreshToken', res);
    this.clearCookie('logged_in', res);
    return { message: 'Logout successful' };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Làm mới Access Token bằng Refresh Token từ cookie' })
  @ApiResponse({ status: 200, description: 'Cấp mới token thành công', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Không tìm thấy hoặc Refresh Token không hợp lệ' })
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
  @ApiBearerAuth()
  @Post('change-password')
  @ApiOperation({ summary: 'Đổi mật khẩu tài khoản' })
  @ApiResponse({ status: 200, description: 'Thay đổi mật khẩu thành công' })
  @ApiResponse({ status: 400, description: 'Mật khẩu cũ không chính xác' })
  async changePassword(@Request() req: any, @Body() data: ChangePasswordDto) {
    const userId = req.user.userId;
    await this.authService.changePassword(userId, data);
    return { message: 'Thay đổi mật khẩu thành công' };
  }

  @Auth(RoleEnum.CUSTOMER)
  @ApiBearerAuth()
  @Post('test-customer')
  @ApiOperation({ summary: 'Test truy cập với quyền CUSTOMER' })
  testCustomer(@Request() req: any) {
    return {
      message: 'Truy cập role CUSTOMER thành công',
      user: req.user,
    };
  }

  @Auth(RoleEnum.ADMIN)
  @ApiBearerAuth()
  @Post('test-admin')
  @ApiOperation({ summary: 'Test truy cập với quyền ADMIN' })
  testAdmin(@Request() req: any) {
    return {
      message: 'Truy cập role ADMIN thành công',
      user: req.user,
    };
  }
}
