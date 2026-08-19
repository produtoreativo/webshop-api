import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common';
import { Response } from 'express';
import { CatalogoService } from './catalogo.service';
import { CriarPedidoDto } from './criar-pedido.dto';

@Controller()
export class CatalogoController {
  constructor(private readonly catalogoService: CatalogoService) {}

  @Get('produtos')
  async getProdutos(@Res({ passthrough: true }) res: Response) {
    try {
      return await this.catalogoService.getProdutos();
    } catch (e) {
      if (e instanceof ServiceUnavailableException) {
        res.setHeader('Retry-After', '5');
      }
      throw e;
    }
  }

  @Post('pedidos')
  @HttpCode(HttpStatus.CREATED)
  async criarPedido(@Body() dto: CriarPedidoDto) {
    return this.catalogoService.criarPedido(dto);
  }

  @Get('pedidos/:id')
  async getPedido(@Param('id') id: string) {
    return this.catalogoService.getPedido(id);
  }
}
