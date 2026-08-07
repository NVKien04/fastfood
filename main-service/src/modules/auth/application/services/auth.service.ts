import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../../../modules/user/application/services/user.service';
import { LoginDto } from '../../presentation/dto/login.dto';
import { CreateUserDto } from '../../../../modules/user/presentation/dto/create-user.dto';
import { JwtPayLoad } from '#src/common/constants/auth.constant';
import type { IRefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.interface';
import { ChangePasswordDto } from '../../presentation/dto/change-password.dto';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  private readonly JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
  private readonly JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  async validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  async register(data: CreateUserDto) {
    return this.userService.register(data);
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    return this.userService.changePassword(userId, data);
  }

  async cleanExpiredTokens(): Promise<void> {
    try {
      await this.refreshTokenRepository.deleteExpiredTokens();
    } catch (error) {
      console.error('Lỗi khi tự động dọn dẹp Refresh Token hết hạn:', error);
    }
  }

  async login(data: LoginDto) {
    await this.cleanExpiredTokens();
    const result = await this.validateUser(data.email, data.password);
    const payload: JwtPayLoad = {
      userId: result.id,
      role: result.role,
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.JWT_ACCESS_SECRET,
      expiresIn: this.JWT_ACCESS_EXPIRES_IN as any,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.JWT_REFRESH_SECRET,
      expiresIn: this.JWT_REFRESH_EXPIRES_IN as any,
    });

    const decoded = this.jwtService.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);
    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: result.id,
      expiresAt,
    });

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async logout(token: string) {
    await this.refreshTokenRepository.deleteByToken(token);
  }

  async refresh(token: string) {
    try {
      await this.cleanExpiredTokens();
      const payload = await this.jwtService.verifyAsync<JwtPayLoad>(token, {
        secret: this.JWT_REFRESH_SECRET,
      });

      const tokenInDb = await this.refreshTokenRepository.findByToken(token);
      if (!tokenInDb || tokenInDb.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
      }

      await this.refreshTokenRepository.deleteByToken(token);

      const newPayload: JwtPayLoad = {
        userId: payload.userId,
        role: payload.role,
      };

      const accessToken = await this.jwtService.signAsync(newPayload, {
        secret: this.JWT_ACCESS_SECRET,
        expiresIn: this.JWT_ACCESS_EXPIRES_IN as any,
      });
      const refreshToken = await this.jwtService.signAsync(newPayload, {
        secret: this.JWT_REFRESH_SECRET,
        expiresIn: this.JWT_REFRESH_EXPIRES_IN as any,
      });

      const decoded = this.jwtService.decode(refreshToken);
      const expiresAt = new Date(decoded.exp * 1000);
      await this.refreshTokenRepository.create({
        token: refreshToken,
        userId: payload.userId,
        expiresAt,
      });

      return { accessToken, refreshToken };
    } catch {
      throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
