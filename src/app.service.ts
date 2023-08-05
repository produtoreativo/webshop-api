import { Injectable } from '@nestjs/common';
import OrderDto from './OrderDto';

@Injectable()
export class AppService {
  getOrder(id: string) {
    throw new Error('Method not implemented.');
  }
  getProducts() {
    throw new Error('Method not implemented.');
  }
  createOrder(orderDto: OrderDto) {
    throw new Error('Method not implemented.');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
