import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OrderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const ORDER_MNGT_API_URL = this.configService.get('ORDER-MNGT-API_URL');
    return this.httpService.axiosRef.post(ORDER_MNGT_API_URL, createOrderDto);
  }

  async listOne(orderId) {
    const ORDER_MNGT_API_URL = this.configService.get('ORDER-MNGT-API_URL');
    return this.httpService.axiosRef.get(ORDER_MNGT_API_URL) || [];
  }
}
