import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;
  let configService: ConfigService;
  let httpService: HttpService;

  beforeEach(async () => {
    httpService = new HttpService();
    configService = new ConfigService();
    service = new OrderService(configService, httpService);
    controller = new OrderController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
