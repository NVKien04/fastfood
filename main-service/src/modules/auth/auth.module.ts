import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from '@/modules/auth/presentation/controllers/auth.controller';
import { RefreshTokensEntity } from '@/entities';
import { AuthorizationGuard, JwtAuthGuard, LocalAuthGuard } from '@/guards';
import { UserModule } from '@/modules/user/user.module';
import { AuthService } from '@/modules/auth/application/services/auth.service';
import { TokenService } from '@/modules/auth/application/services/token.service';
import { JwtStrategy } from '@/modules/auth/presentation/strategies/jwt.strategy';
import { LocalStrategy } from '@/modules/auth/presentation/strategies/local.strategy';
import { RefreshTokenRepository } from '@/modules/auth/infrastructure/persistence/typeorm/refresh-token.typeorm.repository';

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
