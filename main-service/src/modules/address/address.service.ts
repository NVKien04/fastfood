import { PaginationResponse } from '#src/common/core/paganation';
import { CreateAddressDto } from '#src/modules/address/dto/create-address.dto';
import { AddressesEntity } from '#src/entities/addresses.entity';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '#src/modules/user/user.service';
import type { IAddressRepository } from '#src/modules/address/repository/address.repository.interface';

@Injectable()
export class AddressService {
  constructor(
    @Inject('IAddressRepository')
    private readonly addressRepository: IAddressRepository,
    private readonly userService: UserService,
  ) {}

  async create(userId: string, data: CreateAddressDto): Promise<AddressesEntity> {
    const createAddressData: Partial<AddressesEntity> = {
      street: data.street,
      city: data.city,
      district: data.district,
      ward: data.ward,
      isDefault: data.isDefault || 1,
      userId: userId,
    };
    return this.addressRepository.create(createAddressData);
  }

  async findAllByUserId(userId: string): Promise<AddressesEntity[]> {
    return this.addressRepository.findAll({ userId: userId }, { isDefault: 'DESC', createdAt: 'DESC' }, []);
  }

  async update(addressId: string, updateData: Partial<CreateAddressDto>): Promise<AddressesEntity | null> {
    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (updateData.isDefault === 1 && address.isDefault !== 1) {
      // Set all other addresses of the user to isDefault = 0}
    }
    return this.addressRepository.update(addressId, updateData);
  }

  async getPage(FilterObject: any): Promise<PaginationResponse<any>> {
    return this.addressRepository.GetPage(FilterObject);
  }

  async delete(addressId: string) {
    return this.addressRepository.softDelete(addressId);
  }
}
