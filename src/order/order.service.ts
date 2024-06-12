import {
  BadGatewayException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { catchError, map } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class OrderService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  create(accessToken: string, createOrderDto: CreateOrderDto) {
    const ORDER_MNGT_API_URL = this.configService.get('ORDER_MNGT_API_URL');
    return this.httpService.axiosRef.post(ORDER_MNGT_API_URL, createOrderDto);
  }

  async findOne(accessToken: string, orderId: string) {
    const adminAccessToken = await this.authService.getAdminAccessToken();
    const ORDER_MNGT_API_URL = this.configService.get('ORDER_MNGT_API_URL');
    const requestParams: AxiosRequestConfig = {
      url: `${ORDER_MNGT_API_URL}/orders/${orderId}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${adminAccessToken}`,
      },
    };
    const response = await this.httpService.axiosRef.request(requestParams);
    const currentCustomerInfo = await this.authService.getUser(
      accessToken.split(' ')[1],
    );
    const {
      data: { data: order },
    } = response;
    // validação ownership
    if (order.customer_id !== currentCustomerInfo.id) {
      throw new ForbiddenException();
    }
    return response.data;
  }
}
