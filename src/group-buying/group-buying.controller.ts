import { Body, Controller, Post } from '@nestjs/common';
import { GroupBuyingService } from './group-buying.service';

@Controller('group-buying')
export class GroupBuyingController {
  constructor(private readonly groupBuyingService: GroupBuyingService) {}

  @Post()
  create(
    @Body()
    dto: {
      userId: string;
      items: { productId: string; qty: number }[];
    },
  ) {
    return this.groupBuyingService.createCart(dto.userId, dto.items);
  }
}
