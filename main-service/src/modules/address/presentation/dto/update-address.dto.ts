import { PartialType } from '@nestjs/swagger';
import { CreateAddressDto } from '@/modules/address/presentation/dto';

export class UpdateAddressDto extends PartialType(CreateAddressDto) {}
