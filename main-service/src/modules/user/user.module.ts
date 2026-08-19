import { UserCouponsEntity, UserEntity } from '@/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@/modules/user/presentation/controllers/user.controller';
import { UserTypeOrmRepository } from '@/modules/user/infrastructure/persistence/typeorm/user.typeorm.repository';
import { UserService } from '@/modules/user/application/services/user.service';
import { AddressModule } from '@/modules/address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, UserCouponsEntity]), AddressModule],
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
