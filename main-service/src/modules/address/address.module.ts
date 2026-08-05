import { AddressesEntity } from '#src/entities/addresses.entity';
import { AddressTypeOrmRepository } from './infrastructure/address.typeorm.repository';
import { AddressService } from './address.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '#src/modules/user/user.module';
import { AddressController } from './address.controller';
import { ProviceService } from './provice.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([AddressesEntity]), UserModule, HttpModule],
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
