import { AddressesEntity } from '@/entities/addresses.entity';
import { AddressTypeOrmRepository } from '@/modules/address/infrastructure/repositories/address.typeorm.repository';
import { AddressService } from '@/modules/address/application/services/address.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@/modules/user/user.module';
import { AddressController } from '@/modules/address/presentation/controllers/address.controller';
import { ProviceService } from '@/modules/address/application/services/provice.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([AddressesEntity]), forwardRef(() => UserModule), HttpModule],
  controllers: [AddressController],
  providers: [
    AddressService,
    ProviceService,
    {
      provide: 'IAddressRepository',
      useClass: AddressTypeOrmRepository,
    },
  ],
  exports: [AddressService],
})
export class AddressModule {}
