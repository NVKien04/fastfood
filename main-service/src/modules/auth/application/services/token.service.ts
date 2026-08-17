import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';
import { type JwtPayLoad, TokenPair } from '@/modules/auth/domain/interface/auth.interface';
import { RefreshToken } from '@/modules/auth/domain/entities/refresh-token.domain';
import { type IRefreshTokenRepository } from '@/modules/auth/domain/repositories/refresh-token.repository.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('IRefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  private get jwtAccessSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_SECRET', '');
  }

  private get jwtRefreshSecret(): string {
    return this.configService.get<string>('JWT_REFRESH_SECRET', '');
  }

  private get jwtAccessExpiresIn(): StringValue {
    return this.configService.get<StringValue>('JWT_ACCESS_EXPIRES_IN', '15m' as StringValue);
  }

  private get jwtRefreshExpiresIn(): StringValue {
    return this.configService.get<StringValue>('JWT_REFRESH_EXPIRES_IN', '7d' as StringValue);
  }

  // ==========================================
  // TOKEN GENERATION
  // ==========================================

  /**
   * Tạo cặp access + refresh token và lưu refresh token vào DB.
   */
  async generateTokenPair(payload: JwtPayLoad): Promise<TokenPair> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtAccessSecret,
        expiresIn: this.jwtAccessExpiresIn,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtRefreshSecret,
        expiresIn: this.jwtRefreshExpiresIn,
      }),
    ]);

    const decoded = this.jwtService.decode(refreshToken);
    const expiresAt = new Date(decoded.exp * 1000);
    await this.saveRefreshToken(payload.userId, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  // ==========================================
  // TOKEN VERIFICATION & REFRESH
  // ==========================================

  /**
   * Xác thực refresh token, xóa token cũ, tạo cặp token mới (rotation).
   */
  async rotateRefreshToken(token: string): Promise<TokenPair> {
    try {
      await this.cleanExpiredTokens();

      const payload = await this.jwtService.verifyAsync<JwtPayLoad>(token, {
        secret: this.jwtRefreshSecret,
      });

      const tokenInDb = await this.findRefreshToken(token);
      if (!tokenInDb || tokenInDb.expiresAt < new Date()) {
        throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
      }

      await this.revokeRefreshToken(token);

      const newPayload: JwtPayLoad = {
        userId: payload.userId,
        role: payload.role,
      };

      return this.generateTokenPair(newPayload);
    } catch {
      throw new UnauthorizedException('Refresh Token không hợp lệ hoặc đã hết hạn');
    }
  }

  // ==========================================
  // TOKEN REVOCATION
  // ==========================================

  /**
   * Thu hồi một refresh token cụ thể (logout).
   */
  async revokeRefreshToken(token: string): Promise<boolean> {
    return this.refreshTokenRepository.deleteByToken(token);
  }

  /**
   * Thu hồi tất cả refresh token của một user (đổi mật khẩu, bị ban...).
   */
  async revokeAllUserTokens(userId: string): Promise<boolean> {
    return this.refreshTokenRepository.deleteByUserId(userId);
  }

  /**
   * Dọn dẹp các refresh token đã hết hạn.
   */
  async cleanExpiredTokens(): Promise<void> {
    try {
      await this.refreshTokenRepository.deleteExpiredTokens();
    } catch (error) {
      console.error('Lỗi khi tự động dọn dẹp Refresh Token hết hạn:', error);
    }
  }

  // ==========================================
  // PRIVATE HELPERS
  // ==========================================

  private saveRefreshToken(userId: string, token: string, expiresAt: Date): Promise<RefreshToken> {
    return this.refreshTokenRepository.create({ userId, token, expiresAt });
  }

  private findRefreshToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenRepository.findByToken(token);
  }
}
