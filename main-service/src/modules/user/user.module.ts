import { UserCouponsEntity } from '#src/entities/user-coupons.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from '#src/entities/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserCouponsEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
