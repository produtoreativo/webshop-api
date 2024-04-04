import { Test, TestingModule } from '@nestjs/testing';
import { GlobalHttpModule } from '../global-http/global-http.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [GlobalHttpModule],
      controllers: [AuthController],
    })
      .overrideProvider(AuthService)
      .useValue({})
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it.skip('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
