import { Injectable } from '@nestjs/common';
import OrderDto from './OrderDto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}
  
  getOrder(id: string) {
    throw new Error('Method not implemented.');
  }
  async getProducts(query: string) {
    const apiURL = `http://localhost:3001/search?query=${query}`;
    try {
      const response = await this.httpService.axiosRef.get(apiURL);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  }
  createOrder(orderDto: OrderDto) {
    throw new Error('Method not implemented.');
  }
}
