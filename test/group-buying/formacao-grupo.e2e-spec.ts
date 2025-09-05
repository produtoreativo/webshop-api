import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../../src/app.module';
import orderConfig from '@config/order.config';
import { GroupBuyingService } from '@group-buying/group-buying.service';
import { response } from 'express';

describe(`
  Value Stream: Formação de Grupos de Compra
  `, () => {
  let app: INestApplication;
  let service: GroupBuyingService;
  const loggerSpy = { log: jest.fn(), error: jest.fn(), warn: jest.fn() };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(orderConfig.KEY)
      .useValue({ apiUrl: process.env.ORDER_MGMT_API_URL })
      .overrideProvider(Logger)
      .useValue(loggerSpy)
      .compile();
    app = moduleFixture.createNestApplication();
    service = app.get(GroupBuyingService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`
    Para garantir um Troubleshooting eficaz
    Como um engenheiro de confiabilidade
    Eu quero verificar o sistema de logs do sistemas
  `, () => {
    it('should log the correct sequence', async () => {
      const items = [
        { productId: 'p1', qty: 2 },
        { productId: 'p2', qty: 1 },
      ];
      const payload = { orderId: 'g123', userId: 'u1', items };
      const msg1 = `Enviando requisição para ${process.env.ORDER_MGMT_API_URL} com payload`;
      const msg2 = `Resposta recebida: ${JSON.stringify(payload)}`;
      const result = await service.createCart('u1', items);
      expect(result.items.length).toBe(2);
      expect(loggerSpy.log).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining(msg1),
      );
      expect(loggerSpy.log).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining(msg2),
      );
    });
  });

  describe(`
    Para ter descontos a partir de grandes quantidades
    Como um cliente
    Eu quero aderir a um grupo de compras já iniciado
  `, () => {
    /**/
  });

  describe(`
    Para ter descontos a partir de grandes quantidades
    Como um cliente
    Eu quero iniciar um grupo de compras
  `, () => {
    describe(`
    Dado o contrato de Carrinho com Oferta em Grupo
    Quando o controller GroupBying receber um POST em /group_buying
    E o contrato está inválido
    Então deveria lançar um erro 4xx
    Com a mensagem "Oferta inválida"
    #JIRA-1234 Epic Criação do Grupo
  `, () => {
      it('/group-buying (POST) - validation error 400', async () => {
        const dto = { items: [] }; // payload inválido
        await request(app.getHttpServer())
          .post('/group-buying')
          .send(dto)
          .expect(400);
      });
      it('/group-buying (POST) - regression test for missing items', async () => {
        const dto = { userId: 'u1' }; // bug conhecido gerava crash sem items
        await request(app.getHttpServer())
          .post('/group-buying')
          .send(dto)
          .expect(400);
      });
      it('/group-buying (POST) - break test with malformed input', async () => {
        const dto = { userId: 'u1', items: 'INVALID' }; // itens como string
        await request(app.getHttpServer())
          .post('/group-buying')
          .send(dto)
          .expect(400);
      });
    });

    describe(`
      Dado o contrato de Carrinho com Oferta em Grupo
      Quando ocorrer uma falha inesperada no processamento
      Então deveria lançar um erro 500
      Com a mensagem "Algo inesperado aconteceu, tente novamente em instantes"
  `, () => {
      describe(`Cenários de captura de erros: 
        Estilo Crash Test Dummy
      `, () => {
        beforeEach(() => {
          app.get(orderConfig.KEY).apiUrl =
            `${process.env.ORDER_MGMT_API_URL}?__dynamic=true&__code=503&__example=crashError`;
        });
        afterEach(() => {
          app.get(orderConfig.KEY).apiUrl = process.env.ORDER_MGMT_API_URL;
        });
        it('/group-buying (POST) - message 503', async () => {
          console.log('URL de teste:', process.env.ORDER_MGMT_API_URL);
          const dto = { userId: 'u1', items: [{ productId: 'p1', qty: 2 }] };
          await request(app.getHttpServer())
            .post('/group-buying')
            .send(dto)
            .expect((res) => {
              expect(res.body).toHaveProperty('title');
              expect(res.body.title).toContain(
                'Alguma sobrecarga nos acessos, tente novamente em instantes',
              );
            });
        });
      });

      describe(`Cenários de falha por dependências`, () => {
        beforeEach(() => {
          app.get(orderConfig.KEY).apiUrl =
            `${process.env.ORDER_MGMT_API_URL}?__dynamic=true&__code=500&__example=serverError`;
        });
        afterEach(() => {
          app.get(orderConfig.KEY).apiUrl = process.env.ORDER_MGMT_API_URL;
        });

        it('/group-buying (POST) - server error 500', async () => {
          console.log('URL de teste:', process.env.ORDER_MGMT_API_URL);
          const dto = { userId: 'u1', items: [{ productId: 'p1', qty: 2 }] };
          await request(app.getHttpServer())
            .post('/group-buying')
            .send(dto)
            .expect(500);
        });

        it('/group-buying (POST) - message', async () => {
          console.log('URL de teste:', process.env.ORDER_MGMT_API_URL);
          const dto = { userId: 'u1', items: [{ productId: 'p1', qty: 2 }] };
          await request(app.getHttpServer())
            .post('/group-buying')
            .send(dto)
            .expect((res) => {
              expect(res.body).toHaveProperty('title');
              expect(res.body.title).toContain(
                'Algo inesperado aconteceu, tente novamente em instantes',
              );
            });
        });
      });
    });

    describe(`
      Dado o contrato de Carrinho com Oferta em Grupo
      Quando o cliente submeter a adesão
      Então deveria devolver um status 201
      Com a mensagem "Oferta criada com sucesso"
    `, () => {
      it('/group-buying (POST) - success 201', async () => {
        const dto = { userId: 'u1', items: [{ productId: 'p1', qty: 2 }] };
        await request(app.getHttpServer())
          .post('/group-buying')
          .send(dto)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('orderId');
            expect(res.body.userId).toBe(dto.userId);
          });
      });

      it(`/group-buying (POST) - confirmation test
        Dado um grupo criado com sucesso
        Quando o estoque não for suficiente para o total pedido
        Então deveria ter as quantidades ajustadas
      `, async () => {
        const dto = {
          userId: 'u1',
          items: [
            { productId: 'p1', qty: 2 },
            { productId: 'p2', qty: 10 },
          ],
        };
        const retorno = [
          { productId: 'p1', qty: 2 },
          { productId: 'p2', qty: 1 },
        ];
        await request(app.getHttpServer())
          .post('/group-buying')
          .send(dto)
          .expect(201)
          .expect((res) => {
            expect(res.body).toHaveProperty('orderId');
            expect(res.body.userId).toBe(dto.userId);
            // Valida que items existe e tem 2 elementos
            expect(Array.isArray(res.body.items)).toBe(true);
            expect(res.body.items.length).toBe(2);
            expect(res.body.items).toEqual(retorno);
          });
      });
    });
  });
});
