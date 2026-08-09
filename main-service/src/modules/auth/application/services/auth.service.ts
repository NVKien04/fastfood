import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '#src/modules/user/application/services/user.service';
import { LoginDto } from '#src/modules/auth/presentation/dto/login.dto';
import { CreateUserDto } from '#src/modules/user/presentation/dto/create-user.dto';
import { JwtPayLoad } from '#src/common/constants/auth.constant';
import { ChangePasswordDto } from '#src/modules/auth/presentation/dto/change-password.dto';
import { RefreshToken } from '#src/modules/auth/domain/entities/refresh-token.domain';
import type { IRefreshTokenRepository } from '#src/modules/auth/domain/repositories/refresh-token.repository.interface';

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

  // --- Intermediate RefreshTokenRepository wrapper methods ---

  private createRefreshToken(userId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
    return this.refreshTokenRepository.create({ userId, token, expiresAt });
  }

  private getRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findByToken(token);
  }

  private deleteRefreshToken(token: string): Promise<boolean> {
    return this.refreshTokenRepository.deleteByToken(token);
  }

  private deleteRefreshTokensByUserId(userId: string): Promise<boolean> {
    return this.refreshTokenRepository.deleteByUserId(userId);
  }

  private deleteExpiredRefreshTokens(): Promise<void> {
    return this.refreshTokenRepository.deleteExpiredTokens();
  }

  // -------------------------------------------------------------

  validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  register(data: CreateUserDto) {
    return this.userService.register(data);
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    const result = await this.userService.changePassword(userId, data);
    await this.deleteRefreshTokensByUserId(userId);
    return result;
  }

  async cleanExpiredTokens(): Promise<void> {
    try {
      await this.deleteExpiredRefreshTokens();
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
    await this.createRefreshToken(result.id, refreshToken, expiresAt);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async logout(token: string) {
    await this.deleteRefreshToken(token);
  }

  async refresh(token: string) {
    try {
      await this.cleanExpiredTokens();
      const payload = await this.jwtService.verifyAsync<JwtPayLoad>(token, {
        secret: this.JWT_REFRESH_SECRET,
      });

      const tokenInDb = await this.getRefreshToken(token);
      if (!tokenInDb || tokenInDb.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
      }

      await this.deleteRefreshToken(token);

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
      await this.createRefreshToken(payload.userId, refreshToken, expiresAt);

      return { accessToken, refreshToken };
    } catch {
      throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
    }
  }
}
