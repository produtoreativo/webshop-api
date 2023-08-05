import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import OrderDto from 'src/OrderDto';
import { AppService } from 'src/app.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly appService: AppService) {}

  @Post('order')
  async login(@Body() orderDto: OrderDto) {
    return await this.appService.createOrder(orderDto);
  }

  @Get('products')
  async getProducts() {
    return await this.appService.getProducts();
  }

  @Get('order/:id')
  async getOrder(@Param('id') id: string) {
    return await this.appService.getOrder(id);
  }

}
