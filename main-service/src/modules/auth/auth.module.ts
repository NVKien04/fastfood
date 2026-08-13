import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './presentation/controllers/auth.controller';
import { RefreshTokensEntity } from '#src/entities/refresh-tokens.entity';
import { AuthorizationGuard } from '#src/guards/authorization.guard';
import { JwtAuthGuard } from '#src/guards/jwt.guard';
import { LocalAuthGuard } from '#src/guards/local-auth.guard';
import { UserModule } from '#src/modules/user/user.module';
import { AuthService } from './application/services/auth.service';
import { TokenService } from './application/services/token.service';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { LocalStrategy } from './presentation/strategies/local.strategy';
import { RefreshTokenRepository } from './infrastructure/repositories/refresh-token.typeorm.repository';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([RefreshTokensEntity])],
  controllers: [AuthController],
  providers: [
    AuthService,
    TokenService,
    LocalStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    AuthorizationGuard,
    JwtStrategy,
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenRepository,
    },
  ],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
