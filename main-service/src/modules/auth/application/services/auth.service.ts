import { Injectable } from '@nestjs/common';
import { UserService } from '@/modules/user/application/services/user.service';
import { ChangePasswordDto, LoginDto } from '@/modules/auth/presentation/dto';
import { CreateUserDto } from '@/modules/user/presentation/dto';
import { type JwtPayLoad, TokenPair } from '@/modules/auth/domain/interface/auth.interface';
import { TokenService } from '@/modules/auth/application/services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  validateUser(email: string, password: string) {
    return this.userService.validateUser(email, password);
  }

  register(data: CreateUserDto) {
    return this.userService.register(data);
  }

  async changePassword(userId: string, data: ChangePasswordDto) {
    const result = await this.userService.changePassword(userId, data);
    await this.tokenService.revokeAllUserTokens(userId);
    return result;
  }

  async login(data: LoginDto): Promise<TokenPair> {
    await this.tokenService.cleanExpiredTokens();
    const result = await this.validateUser(data.email, data.password);

    const payload: JwtPayLoad = {
      userId: result.id,
      role: result.role,
    };

    return this.tokenService.generateTokenPair(payload);
  }

  async logout(token: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(token);
  }

  async refresh(token: string): Promise<TokenPair> {
    return this.tokenService.rotateRefreshToken(token);
  }
}
