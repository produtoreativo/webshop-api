import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { GetUserToken } from '../auth/get-user-token.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(
    @GetUserToken() accessToken: string,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.orderService.create(accessToken, createOrderDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(
    @GetUserToken() accessToken: string,
    @Param('id') orderId: string,
  ) {
    return this.orderService.findOne(accessToken, orderId);
  }
}
