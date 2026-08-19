import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CriarPedidoDto } from './criar-pedido.dto';

@Injectable()
export class CatalogoService {
  constructor(private readonly httpService: HttpService) {}

  async getProdutos() {
    const searchUrl = process.env.SEARCH_API_URL || 'http://localhost:3001';
    try {
      const response = await this.httpService.axiosRef.get(
        `${searchUrl}/produtos`,
      );
      return response.data;
    } catch (e) {
      if (e?.response?.status >= 500) {
        throw new ServiceUnavailableException('search-api indisponível');
      }
      throw e;
    }
  }

  async criarPedido(dto: CriarPedidoDto) {
    const orderUrl = process.env.ORDER_API_URL || 'http://localhost:3002';
    const response = await this.httpService.axiosRef.post(
      `${orderUrl}/pedidos`,
      dto,
    );
    return response.data;
  }

  async getPedido(id: string) {
    const orderUrl = process.env.ORDER_API_URL || 'http://localhost:3002';
    try {
      const response = await this.httpService.axiosRef.get(
        `${orderUrl}/pedidos/${id}`,
      );
      return response.data;
    } catch (e) {
      if (e?.response?.status === 404) {
        throw new NotFoundException(`Pedido ${id} não encontrado`);
      }
      throw e;
    }
  }
}
