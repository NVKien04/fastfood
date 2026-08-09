import { UserCouponsEntity } from '@/entities/user-coupons.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './presentation/controllers/user.controller';
import { UserEntity } from '@/entities/user.entity';
import { UserTypeOrmRepository } from './infrastructure/repositories/user.typeorm.repository';
import { UserService } from './application/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserCouponsEntity])],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: 'IUserRepository',
      useClass: UserTypeOrmRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
