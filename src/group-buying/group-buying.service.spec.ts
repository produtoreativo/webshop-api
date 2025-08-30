import { Test, TestingModule } from '@nestjs/testing';
import { GroupBuyingService } from './group-buying.service';

describe('GroupBuyingService', () => {
  let service: GroupBuyingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupBuyingService],
    }).compile();

    service = module.get<GroupBuyingService>(GroupBuyingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
