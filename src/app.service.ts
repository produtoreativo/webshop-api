import { Injectable } from '@nestjs/common';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
import OrderDto from './OrderDto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    @InjectPinoLogger(AppService.name)
    private readonly logger: PinoLogger,
  ) {}

  getOrder(id: string, accessToken: string) {
    throw new Error('Method not implemented.');
  }
  async getProducts(query: string) {
    const apiURL = `http://localhost:3001/search?query=${query}`;
    try {
      const response = await this.httpService.axiosRef.get(apiURL);
      this.logger.info('DATA ****', response.data);
      return response.data;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async createOrder(orderDto: OrderDto, accessToken: string) {
    const apiURL = `http://localhost:3002/order`;
    try {
      const response = await this.httpService.axiosRef.post(
        apiURL,
        JSON.stringify(orderDto),
      );
      return response.data;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
