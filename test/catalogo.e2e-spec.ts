import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpService } from '@nestjs/axios';

describe('CatalogoModule (e2e)', () => {
  let app: INestApplication;

  const mockAxiosRef = {
    get: jest.fn(),
    post: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(HttpService)
      .useValue({ axiosRef: mockAxiosRef })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /produtos', () => {
    it('deve retornar 200 com lista de produtos', async () => {
      mockAxiosRef.get.mockResolvedValue({
        data: {
          produtos: [
            {
              id: 'p1',
              nome: 'Produto Teste',
              preco: 29.9,
              disponivel: true,
            },
          ],
        },
      });

      const res = await request(app.getHttpServer()).get('/produtos');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('produtos');
      expect(Array.isArray(res.body.produtos)).toBe(true);
      expect(res.body.produtos[0]).toMatchObject({
        id: expect.any(String),
        nome: expect.any(String),
        preco: expect.any(Number),
        disponivel: expect.any(Boolean),
      });
    });

    it('deve retornar 503 com Retry-After:5 quando search-api retorna 5xx', async () => {
      const axiosError = new Error('Service Unavailable');
      (axiosError as any).isAxiosError = true;
      (axiosError as any).response = { status: 503 };
      mockAxiosRef.get.mockRejectedValue(axiosError);

      const res = await request(app.getHttpServer()).get('/produtos');

      expect(res.status).toBe(503);
      expect(res.headers['retry-after']).toBe('5');
    });
  });

  describe('POST /pedidos', () => {
    const validBody = {
      productId: 'prod-001',
      customerId: 'cust-001',
      correlationId: 'corr-001',
    };

    it('deve retornar 201 com pedidoId ao criar pedido válido', async () => {
      mockAxiosRef.post.mockResolvedValue({
        data: {
          pedidoId: 'pedido-abc',
          productId: 'prod-001',
          customerId: 'cust-001',
          correlationId: 'corr-001',
          status: 'criado',
        },
      });

      const res = await request(app.getHttpServer())
        .post('/pedidos')
        .send(validBody);

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        pedidoId: expect.any(String),
        productId: 'prod-001',
        customerId: 'cust-001',
        correlationId: 'corr-001',
        status: 'criado',
      });
    });

    it('deve retornar o mesmo pedidoId para mesmo correlationId (idempotência)', async () => {
      const mockResponse = {
        data: {
          pedidoId: 'pedido-idem-123',
          productId: 'prod-001',
          customerId: 'cust-001',
          correlationId: 'corr-idem',
          status: 'criado',
        },
      };
      mockAxiosRef.post.mockResolvedValue(mockResponse);

      const body = { ...validBody, correlationId: 'corr-idem' };
      const res1 = await request(app.getHttpServer())
        .post('/pedidos')
        .send(body);
      const res2 = await request(app.getHttpServer())
        .post('/pedidos')
        .send(body);

      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
      expect(res1.body.pedidoId).toBe(res2.body.pedidoId);
    });

    it('deve retornar 422 quando productId não é fornecido', async () => {
      const res = await request(app.getHttpServer())
        .post('/pedidos')
        .send({ customerId: 'cust-001', correlationId: 'corr-001' });

      expect(res.status).toBe(422);
    });

    it('deve retornar 422 quando productId está vazio', async () => {
      const res = await request(app.getHttpServer()).post('/pedidos').send({
        productId: '',
        customerId: 'cust-001',
        correlationId: 'corr-001',
      });

      expect(res.status).toBe(422);
    });
  });

  describe('GET /pedidos/:id', () => {
    it('deve retornar 200 com detalhes do pedido existente', async () => {
      mockAxiosRef.get.mockResolvedValue({
        data: {
          pedidoId: 'pedido-abc',
          productId: 'prod-001',
          customerId: 'cust-001',
          correlationId: 'corr-001',
          status: 'criado',
        },
      });

      const res = await request(app.getHttpServer()).get('/pedidos/pedido-abc');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        pedidoId: expect.any(String),
        productId: expect.any(String),
        customerId: expect.any(String),
        correlationId: expect.any(String),
        status: 'criado',
      });
    });

    it('deve retornar 404 para pedido inexistente', async () => {
      const axiosError = new Error('Not Found');
      (axiosError as any).isAxiosError = true;
      (axiosError as any).response = { status: 404 };
      mockAxiosRef.get.mockRejectedValue(axiosError);

      const res = await request(app.getHttpServer()).get('/pedidos/nao-existe');

      expect(res.status).toBe(404);
    });
  });
});
