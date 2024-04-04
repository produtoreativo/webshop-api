import { ConfigService } from '@nestjs/config';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { HttpService } from '@nestjs/axios';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;
  let configService: ConfigService;
  let httpService: HttpService;

  beforeEach(async () => {
    httpService = new HttpService();
    configService = new ConfigService();
    service = new ProductService(configService, httpService);
    controller = new ProductController(service);
  });
  describe('Listagem simples', () => {
    it('Chama o método listAll do service ', async () => {
      const mockServiceMethod = jest
        .spyOn(service, 'listAll')
        .mockImplementation(jest.fn());

      await controller.listAll();

      expect(mockServiceMethod).toBeCalled();
    });
  });
});
