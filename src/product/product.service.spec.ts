import { ConfigService } from '@nestjs/config';
import { ProductService } from './product.service';
import { HttpService } from '@nestjs/axios';

describe('ProductService', () => {
  let service: ProductService;
  let configService: ConfigService;
  let httpService: HttpService;

  beforeEach(async () => {
    configService = new ConfigService();
    httpService = new HttpService();

    service = new ProductService(configService, httpService);
  });
  describe('Listagem simples', () => {
    it('Deve realizar uma chamada http ao serviço search-api', () => {
      const mockHttpMethod = jest
        .spyOn(httpService.axiosRef, 'get')
        .mockImplementation(jest.fn());

      service.listAll();

      expect(mockHttpMethod).toHaveBeenCalledTimes(1);
    });
  });
});
