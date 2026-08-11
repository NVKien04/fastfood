import { AddressesEntity } from '#src/entities/addresses.entity';
import { AddressTypeOrmRepository } from './infrastructure/repositories/address.typeorm.repository';
import { AddressService } from './application/services/address.service';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '#src/modules/user/user.module';
import { AddressController } from './presentation/controllers/address.controller';
import { ProviceService } from './application/services/provice.service';
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
