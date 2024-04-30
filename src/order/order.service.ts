import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs';

@Injectable()
export class OrderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  create(createOrderDto: CreateOrderDto) {
    const ORDER_MNGT_API_URL = this.configService.get('ORDER_MNGT_API_URL');
    return this.httpService.axiosRef.post(ORDER_MNGT_API_URL, createOrderDto);
  }

  async findOne(orderId: string) {
    const ORDER_MNGT_API_URL = this.configService.get('ORDER_MNGT_API_URL');
    return this.httpService
      .get(`${ORDER_MNGT_API_URL}/orders/${orderId}`)
      .pipe(
        map(({ data }) => {
          return data;
        }),
      )
      .pipe(
        catchError((result) => {
          if (result.response?.status === 404) {
            throw new NotFoundException();
          }
          throw new BadGatewayException();
        }),
      );
  }
}
