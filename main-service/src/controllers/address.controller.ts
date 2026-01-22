import { AddressService } from '#src/services/address.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('get-page')
  async getPage(@Body() filterObject: any) {
    return await this.addressService.getPage(filterObject);
  }
}
