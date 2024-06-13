import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosRequestConfig } from 'axios';
import { AuthService } from '../auth/auth.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly authService: AuthService,
  ) {}

  async create(accessToken: string, createOrderDto: CreateOrderDto) {
    const userInfo = await this.authService.getUser(accessToken.split(' ')[1]);
    const ORDER_MNGT_API_URL = this.configService.get('ORDER_MNGT_API_URL');
    const { items } = createOrderDto;
    const payload = {
      currency_id: 'USD',
      email: userInfo.email,
      billing_address: {
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        street: ['123 Main St'],
        city: 'Anytown',
        region: 'CA',
        region_id: 12,
        postcode: '12345',
        country_id: 'US',
        telephone: '555-555-5555',
      },
      shipping_address: {
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        street: ['123 Main St'],
        city: 'Anytown',
        region: 'CA',
        region_id: 12,
        postcode: '12345',
        country_id: 'US',
        telephone: '555-555-5555',
      },
      items,
      payment_method: {
        method: 'checkmo',
      },
      shipping_method: {
        method_code: 'flatrate',
        carrier_code: 'flatrate',
      },
      use_default_address: false,
    };
    const requestConfig: AxiosRequestConfig = {
      url: `${ORDER_MNGT_API_URL}/orders`,
      method: 'POST',
      data: payload,
      headers: {
        Authorization: accessToken,
      },
    };
    try {
      const response = await this.httpService.axiosRef.request(requestConfig);
      return response.data;
    } catch (error) {
      this.logger.error('Error on create order', error.message);
    }
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
