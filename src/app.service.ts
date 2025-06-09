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

  async getOrder(id: string, accessToken: string) {
    const apiURL = `http://localhost:3001/error`;
    console.log('apiURL', apiURL);
    const response = await this.httpService.axiosRef.get(apiURL);
    return response.data;
  }

  async getProducts(query: string) {
    const apiURL = `http://localhost:3001/search?query=${query}`;
    try {
      const response = await this.httpService.axiosRef.get(apiURL);
      // const data = JSON.parse(response.data);
      this.logger.info('DATA ****', response.data);
      // console.warn('DATA ****', data)
      return response.data;
    } catch (e) {
      this.logger.error(e);
    }
  }

  async createOrder(orderDto: OrderDto) {
    const apiURL = `http://localhost:3002/order`;
    console.log('Service: ', orderDto);
    try {
      const response = await this.httpService.axiosRef.post(
        apiURL,
        orderDto,
        // JSON.stringify(orderDto),
      );
      return response.data;
    } catch (e) {
      this.logger.error(e);
    }
  }
}
