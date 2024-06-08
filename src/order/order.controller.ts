import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';
import { GetUserToken } from '../auth/get-user-token.decorator';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';

@ApiTags('Orders')
@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly authService: AuthService,
  ) {}

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
    // @GetAdminToken() adminAccessToken: string,
    @Param('id') orderId: string,
  ) {
    // Obter um token de admin
    const adminAccessToken = await this.authService.getAdminAccessToken();

    const order = await this.orderService.findOne(adminAccessToken, orderId);

    // validação ownership
  }
}
