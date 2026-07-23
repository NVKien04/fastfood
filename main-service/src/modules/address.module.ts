import { AddressesEntity } from '#src/entities/addresses.entity';
import { AddressRepository } from '#src/repositories/address/address.repository';
import { AddressService } from '#src/services/address.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user.module';
import { AddressController } from '#src/controllers/address.controller';
import { ProviceService } from '#src/services/provice.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([AddressesEntity]), UserModule, HttpModule],
  controllers: [AddressController],
  providers: [
    AddressService,
    ProviceService,
    {
      provide: 'IAddressRepository',
      useClass: AddressRepository,
    },
  ],
  exports: [AddressService],
})
export class AddressModule {}
