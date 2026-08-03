import { buildPaginationResponse, PaginationResponse } from '#src/common/core/paganation';
import { CreateAddressDto } from '#src/modules/address/dto/create-address.dto';
import { AddressesEntity } from '#src/entities/addresses.entity';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '#src/modules/user/user.service';
import type { IAddressRepository } from '#src/modules/address/repository/address.repository.interface';
import { BusinessException } from '#src/common/exception/biz.exception';
import { ErrorEnum } from '#src/common/constants/error-code.constant';

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
      throw new BusinessException(ErrorEnum.ADDRESS_NOT_FOUND);
    }

    if (updateData.isDefault === 1 && address.isDefault !== 1) {
      // Set all other addresses of the user to isDefault = 0
    }
    return this.addressRepository.update(addressId, updateData);
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.addressRepository.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async delete(addressId: string) {
    const address = await this.addressRepository.findById(addressId);
    if (!address) {
      throw new BusinessException(ErrorEnum.ADDRESS_NOT_FOUND);
    }
    return this.addressRepository.softDelete(addressId);
  }
}
