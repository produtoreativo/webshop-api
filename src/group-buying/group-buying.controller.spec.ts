import { Test, TestingModule } from '@nestjs/testing';
import { GroupBuyingController } from './group-buying.controller';
import { GroupBuyingService } from './group-buying.service';

describe('GroupBuyingController', () => {
  let controller: GroupBuyingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupBuyingController],
      providers: [GroupBuyingService],
    }).compile();

    controller = module.get<GroupBuyingController>(GroupBuyingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
