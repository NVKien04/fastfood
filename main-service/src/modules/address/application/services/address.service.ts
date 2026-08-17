import { PaginationResponse, buildPaginationResponse } from '@/common/core';
import { CreateAddressDto } from '@/modules/address/presentation/dto';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UserService } from '@/modules/user/application/services/user.service';
import { BusinessException } from '@/common/exception';
import { ErrorEnum } from '@/common/constants';
import { Address } from '@/modules/address/domain/entities/address.domain';
import { type IAddressRepository } from '@/modules/address/domain/repositories/address.repository.interface';

@Injectable()
export class AddressService {
  constructor(
    @Inject('IAddressRepository')
    private readonly addressRepository: IAddressRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  // ==========================================
  // NHÓM 1: CÁC HÀM WRAPPER (ỦY QUYỀN REPOSITORY)
  // ==========================================

  async findById(id: string): Promise<Address | null> {
    return this.addressRepository.findById(id);
  }

  async findOne(condition: Partial<Address>): Promise<Address | null> {
    return this.addressRepository.findOne(condition);
  }

  async findAll(
    condition?: Partial<Address>,
    order?: Record<string, 'ASC' | 'DESC'>,
    relations?: string[],
  ): Promise<Address[]> {
    return this.addressRepository.findAll(condition, order, relations);
  }

  async save(entity: Partial<Address>): Promise<Address> {
    return this.addressRepository.create(entity);
  }

  async updateRaw(id: string, entity: Partial<Address>): Promise<Address | null> {
    return this.addressRepository.update(id, entity);
  }

  async softDeleteRaw(id: string): Promise<boolean> {
    return this.addressRepository.softDelete(id);
  }

  async findPaginated(options: any, where?: Record<string, any>): Promise<[Address[], number]> {
    return this.addressRepository.findPaginated(options, where);
  }

  // ==========================================
  // NHÓM 2: CÁC HÀM NGHIỆP VỤ THỰC TẾ (BUSINESS LOGIC)
  // ==========================================

  async create(userId: string, data: CreateAddressDto): Promise<Address> {
    const createAddressData: Partial<Address> = {
      street: data.street,
      city: data.city,
      district: data.district,
      ward: data.ward,
      isDefault: data.isDefault || 1,
      userId: userId,
    };
    return this.save(createAddressData);
  }

  async findAllByUserId(userId: string): Promise<Address[]> {
    return this.findAll({ userId: userId }, { isDefault: 'DESC', createdAt: 'DESC' }, []);
  }

  async update(addressId: string, updateData: Partial<CreateAddressDto>): Promise<Address | null> {
    const address = await this.findById(addressId);
    if (!address) {
      throw new BusinessException(ErrorEnum.ADDRESS_NOT_FOUND);
    }

    if (updateData.isDefault === 1 && address.isDefault !== 1) {
      // Set all other addresses of the user to isDefault = 0
    }
    return this.updateRaw(addressId, updateData);
  }

  async getPage(filterObject: any): Promise<PaginationResponse<any>> {
    const page = Math.max(1, Number(filterObject?.page ?? 1));
    const limit = Math.max(1, Math.min(100, Number(filterObject?.limit ?? 10)));
    const skip = (page - 1) * limit;

    const [data, totalItems] = await this.findPaginated({
      skip,
      take: limit,
      orderBy: filterObject?.orderby,
    });

    return buildPaginationResponse(data, totalItems, page, limit);
  }

  async delete(addressId: string) {
    const address = await this.findById(addressId);
    if (!address) {
      throw new BusinessException(ErrorEnum.ADDRESS_NOT_FOUND);
    }
    return this.softDeleteRaw(addressId);
  }
}
