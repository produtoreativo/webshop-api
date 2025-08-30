import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Formação do Grupo de Compra', async () => {
    const dto = {
      userId: 'u1',
      items: [{ productId: 'p1', qty: 2 }],
    };
    await request(app.getHttpServer())
      .post('/group-buying')
      .send(dto)
      .expect(201)
      .expect((res) => {
        expect(res.body.userId).toBe(dto.userId);
        expect(res.body).toHaveProperty('orderId');
      });
  });
});
