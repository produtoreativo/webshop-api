import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { OrderService } from '../src/order/order.service';

describe('OrdersController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(OrderService)
      .useValue({ create: () => ({ id: 1 }), findOne: () => ({ id: 1 }) })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true })); // Enable dto validation
    await app.init();
  });

  it('/orders (POST)', () => {
    return (
      request(app.getHttpServer())
        .post('/orders')
        // .set('Authorization', `Bearer ${token}`)
        .send({ items: [{ sku: '123', quantity: 3 }] })
        .expect(201)
        .expect(({ body }) => {
          expect(body.id).toBeDefined();
        })
    );
  });

  it('/orders/:id (GET)', () => {
    return request(app.getHttpServer()).get('/orders/1').expect(200);
  });
});
