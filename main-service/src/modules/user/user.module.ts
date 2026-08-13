import { UserCouponsEntity } from '@/entities/user-coupons.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@/modules/user/presentation/controllers/user.controller';
import { UserEntity } from '@/entities/user.entity';
import { UserTypeOrmRepository } from '@/modules/user/infrastructure/repositories/user.typeorm.repository';
import { UserService } from '@/modules/user/application/services/user.service';
import { AddressModule } from '@/modules/address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserCouponsEntity]),
    AddressModule,
  ],
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
