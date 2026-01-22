import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProviceService {
  private readonly provinceUrl = 'https://provinces.open-api.vn/api/v2/';
  constructor(private readonly httpService: HttpService) {}

  async getProvinces(): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(this.provinceUrl + 'p/'),
      );
      return res?.data;
    } catch (error) {
      console.error('Error fetching provinces:', error);
      throw new BadRequestException('Lỗi khi lấy danh sách tỉnh/thành phố');
    }
  }

  async getDistricts(provinceCode: string): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(
          this.provinceUrl + 'p/' + provinceCode + '?depth=2',
        ),
      );
      return res?.data?.districts;
    } catch (error) {
      console.error('Error fetching districts:', error);
      throw new BadRequestException('Lỗi khi lấy danh sách quận/huyện');
    }
  }

  async getWards(districtCode: string): Promise<any> {
    try {
      const res = await firstValueFrom(
        this.httpService.get(
          this.provinceUrl + 'd/' + districtCode + '?depth=2',
        ),
      );
      return res?.data?.wards;
    } catch (error) {
      console.error('Error fetching wards:', error);
      throw new BadRequestException('Lỗi khi lấy danh sách phường/xã');
    }
  }
}
