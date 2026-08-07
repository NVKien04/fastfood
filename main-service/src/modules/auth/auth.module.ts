import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './presentation/controllers/auth.controller';
import { UserEntity } from '#src/entities/user.entity';
import { RefreshTokensEntity } from '#src/entities/refresh-tokens.entity';
import { AuthorizationGuard } from '#src/guards/authorization.guard';
import { JwtAuthGuard } from '#src/guards/jwt.guard';
import { LocalAuthGuard } from '#src/guards/local-auth.guard';
import { UserTypeOrmRepository } from '#src/modules/user/infrastructure/repositories/user.typeorm.repository';
import { AuthService } from './application/services/auth.service';
import { UserService } from '#src/modules/user/application/services/user.service';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';
import { LocalStrategy } from './presentation/strategies/local.strategy';
import { RefreshTokenRepository } from './infrastructure/repositories/refresh-token.typeorm.repository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    LocalAuthGuard,
    JwtAuthGuard,
    AuthorizationGuard,
    JwtStrategy,
    {
      provide: 'IUserRepository',
      useClass: UserTypeOrmRepository,
    },
    {
      provide: 'IRefreshTokenRepository',
      useClass: RefreshTokenRepository,
    },
  ],
  exports: [AuthService],
  imports: [TypeOrmModule.forFeature([UserEntity, RefreshTokensEntity])],
})
export class AuthModule {}
