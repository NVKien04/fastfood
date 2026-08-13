import { Injectable } from '@nestjs/common';
import { UserService } from '#src/modules/user/application/services/user.service';
import { LoginDto } from '#src/modules/auth/presentation/dto/login.dto';
import { CreateUserDto } from '#src/modules/user/presentation/dto/create-user.dto';
import { JwtPayLoad } from '#src/common/constants/auth.constant';
import { ChangePasswordDto } from '#src/modules/auth/presentation/dto/change-password.dto';
import { TokenService, type TokenPair } from './token.service';

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
