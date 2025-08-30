import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GroupBuyingService {
  constructor(private readonly http: HttpService) {}
  private readonly url = `${process.env.ORDER_MGMT_API_URL}`;

  async create(dto) {
    const { userId, items } = dto;
    const response = await firstValueFrom(
      this.http.post(this.url, { userId, items }),
    );
    return response.data;
  }
}
