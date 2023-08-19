import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import OrderDto from './OrderDto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUserToken } from './auth/get-user-token.decorator';
import { AuthGuard } from './auth/auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @ApiBearerAuth()
  // @UseGuards(AuthGuard)
  @Post('order')
  async createOrder(
    // @GetUserToken() accessToken: string,
    @Body() orderDto: OrderDto) {
      console.log('Controller:',  orderDto);
    return this.appService.createOrder(orderDto);
  }

  @Get('products')
  async getProducts(@Query('query') query: string) {
    return this.appService.getProducts(query);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('order/:id')
  async getOrder(
    @GetUserToken() accessToken: string,
    @Param('id') orderId: string,
  ) {
    return this.appService.getOrder(orderId, accessToken);
  }
}
