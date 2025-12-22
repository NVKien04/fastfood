import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from 'src/controllers/auth.controller';

import { UserEntity } from 'src/entities/user.entity';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { UserRepository } from 'src/repositories/user/user.repository';
import { AuthService } from 'src/services/auth.service';
import { UserService } from 'src/services/user.service';

import { LocalStrategy } from 'src/strategies/local.strategy';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    LocalStrategy,
    LocalAuthGuard,
    {
      provide: 'UserRepositoryInterface',
      useClass: UserRepository,
    },
  ],

  exports: [AuthService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class AuthModule {}
