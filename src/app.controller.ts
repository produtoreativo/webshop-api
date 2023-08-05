import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import OrderDto from './OrderDto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('order')
  async login(@Body() orderDto: OrderDto) {
    return await this.appService.createOrder(orderDto);
  }

  @Get('products')
  async getProducts(@Query('query') query: string) {
    return await this.appService.getProducts(query);
  }

  @Get('order/:id')
  async getOrder(@Param('id') id: string) {
    return await this.appService.getOrder(id);
  }
}
