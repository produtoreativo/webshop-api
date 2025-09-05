import { Logger, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GroupBuyingService } from './group-buying.service';
import { GroupBuyingController } from './group-buying.controller';

@Module({
  imports: [HttpModule],
  controllers: [GroupBuyingController],
  providers: [GroupBuyingService, Logger],
})
export class GroupBuyingModule {}
