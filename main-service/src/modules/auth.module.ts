import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/controllers/auth.controller';
import { UserEntity } from 'src/entities/user.entity';
import { AuthorizationGuard } from 'src/guards/authorization.guard';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserRepository } from 'src/repositories/user/user.repository';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

import { LocalStrategy } from 'src/strategies/local.strategy';

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
      useClass: UserRepository,
    },
  ],

  exports: [AuthService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class AuthModule {}
