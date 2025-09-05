import { AxiosRequestConfig } from 'axios';
import { HttpService } from '@nestjs/axios';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { ConfigType } from '@nestjs/config';
import orderConfig from '@config/order.config';
import { OrderError } from './errors/order.error';

const config: AxiosRequestConfig = {
  headers: {
    'Content-Type': 'application/json',
    // Prefer: 'code=500',
  },
};

@Injectable()
export class GroupBuyingService {
  constructor(
    private readonly http: HttpService,
    @Inject(orderConfig.KEY)
    private orderCfg: ConfigType<typeof orderConfig>,
    private readonly logger: Logger,
  ) {}

  async createCart(userId: string, items: any[]) {
    const url = this.orderCfg.apiUrl;
    // console.log('URL de teste [XXXXXXXX]:', url);
    this.logger.log(`Enviando requisição para ${url} com payload`);
    try {
      const response = await firstValueFrom(
        this.http.post(url, { userId, items }, config),
      );
      // console.log('Resposta [YYYYYYYY]:', response.data);
      this.logger.log(`Resposta recebida: ${JSON.stringify(response.data)}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        const statusCode = error.response?.status || 503;
        const data = error.response?.data || {};
        const title = data.title || 'External service error';
        const detail = data.detail || data.message;
        const instance = data.instance || url;
        throw new OrderError({
          status: statusCode,
          title,
          detail,
          instance,
        });
      }
      throw new HttpException(
        'External service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
