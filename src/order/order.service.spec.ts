import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let configService: ConfigService;
  let httpService: HttpService;

  beforeEach(async () => {
    configService = new ConfigService();
    httpService = new HttpService();
    service = new OrderService(configService, httpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
