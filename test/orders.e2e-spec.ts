import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/prisma.service';

describe('OrdersController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;
  let testUserId: string;
  let testOrderId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

   
    const testUser = await prisma.user.create({
      data: {
        email: `test-orders-${Date.now()}@test.com`,
        password: 'test123',
        name: 'Test User for Orders',
      },
    });
    testUserId = testUser.id;
  });

  afterAll(async () => {
    try {
      // Limpar dados de teste - deletar todas as ordens do usuário de teste primeiro
      if (testUserId && prisma) {
        // Deletar todas as ordens do usuário de teste
        await prisma.order.deleteMany({
          where: { userId: testUserId },
        }).catch(() => {});
        
        // Depois deletar o usuário
        await prisma.user.delete({
          where: { id: testUserId },
        }).catch(() => {});
      }
    } catch (error) {
      // Ignorar erros durante limpeza
    } finally {
      // Sempre fechar a aplicação
      if (app) {
        await app.close();
      }
    }
  });

  describe('POST /orders', () => {
    it('deve criar uma ordem de compra com sucesso', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'BUY',
          quantity: 10,
          price: 100.50,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.userId).toBe(testUserId);
          expect(res.body.assetId).toBe(1);
          expect(res.body.type).toBe('BUY');
          expect(res.body.quantity).toBe(10);
          expect(res.body.price).toBe(100.50);
          expect(res.body.status).toBe('PENDING');
          testOrderId = res.body.id;
        });
    });

    it('deve criar uma ordem de venda com sucesso', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 2,
          type: 'SELL',
          quantity: 5,
          price: 250.75,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.type).toBe('SELL');
          expect(res.body.status).toBe('PENDING');
        });
    });

    it('deve retornar erro 404 quando usuário não existe', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: '00000000-0000-0000-0000-000000000000',
          assetId: 1,
          type: 'BUY',
          quantity: 10,
          price: 100.50,
        })
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Usuário não encontrado');
        });
    });

    it('deve retornar erro 404 quando ativo não existe', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 999,
          type: 'BUY',
          quantity: 10,
          price: 100.50,
        })
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Ativo não encontrado');
        });
    });

    it('deve retornar erro 400 quando quantidade é menor ou igual a zero', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'BUY',
          quantity: 0,
          price: 100.50,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Quantidade deve ser maior que zero');
        });
    });

    it('deve retornar erro 400 quando quantidade é negativa', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'BUY',
          quantity: -5,
          price: 100.50,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Quantidade deve ser maior que zero');
        });
    });

    it('deve retornar erro 400 quando preço é menor ou igual a zero', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'BUY',
          quantity: 10,
          price: 0,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Preço deve ser maior que zero');
        });
    });

    it('deve retornar erro 400 quando preço é negativo', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'BUY',
          quantity: 10,
          price: -10.50,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Preço deve ser maior que zero');
        });
    });

    it('deve retornar erro 400 quando tipo é inválido', () => {
      return request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'INVALID_TYPE',
          quantity: 10,
          price: 100.50,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain('Tipo deve ser BUY ou SELL');
        });
    });
  });

  describe('GET /orders', () => {
    it('deve retornar todas as ordens', () => {
      return request(app.getHttpServer())
        .get('/orders')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('deve retornar ordens filtradas por userId', async () => {
      // Criar uma ordem para garantir que existe pelo menos uma
      await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 3,
          type: 'BUY',
          quantity: 15,
          price: 50.25,
        });

      return request(app.getHttpServer())
        .get(`/orders?userId=${testUserId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((order: any) => {
            expect(order.userId).toBe(testUserId);
          });
        });
    });

    it('deve retornar erro 404 quando userId não existe', () => {
      return request(app.getHttpServer())
        .get('/orders?userId=00000000-0000-0000-0000-000000000000')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Usuário não encontrado');
        });
    });

    it('deve retornar ordens filtradas por assetId', async () => {
      // Criar uma ordem com assetId específico
      await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 4,
          type: 'SELL',
          quantity: 20,
          price: 75.50,
        });

      return request(app.getHttpServer())
        .get('/orders?assetId=4')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((order: any) => {
            expect(order.assetId).toBe(4);
          });
        });
    });

    it('deve retornar erro 404 quando assetId não existe', () => {
      return request(app.getHttpServer())
        .get('/orders?assetId=999')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Ativo não encontrado');
        });
    });
  });

  describe('GET /orders/mock/assets', () => {
    it('deve retornar lista de assets mockados', () => {
      return request(app.getHttpServer())
        .get('/orders/mock/assets')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThan(0);
          expect(res.body[0]).toHaveProperty('id');
          expect(res.body[0]).toHaveProperty('name');
          expect(res.body[0]).toHaveProperty('symbol');
        });
    });
  });

  describe('GET /orders/:id', () => {
    it('deve retornar uma ordem específica por ID', async () => {
      // Criar uma ordem para buscar
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 5,
          type: 'BUY',
          quantity: 30,
          price: 200.00,
        });

      const orderId = createResponse.body.id;

      return request(app.getHttpServer())
        .get(`/orders/${orderId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', orderId);
          expect(res.body.userId).toBe(testUserId);
          expect(res.body.assetId).toBe(5);
        });
    });

    it('deve retornar erro 404 quando ordem não existe', () => {
      return request(app.getHttpServer())
        .get('/orders/00000000-0000-0000-0000-000000000000')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Ordem não encontrada');
        });
    });
  });

  describe('PUT /orders/:id', () => {
    let executedOrderId: string;

    beforeAll(async () => {
      // Criar uma ordem executada para testar bloqueio de atualização
      const executedResponse = await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 2,
          type: 'SELL',
          quantity: 5,
          price: 250.75,
        });
      executedOrderId = executedResponse.body.id;

      // Atualizar para EXECUTED
      await prisma.order.update({
        where: { id: executedOrderId },
        data: { status: 'EXECUTED' },
      });
    });

    it('deve atualizar status da ordem com sucesso', async () => {
      // Criar uma nova ordem para este teste
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'BUY',
          quantity: 10,
          price: 100.50,
        });
      const orderId = createResponse.body.id;

      return request(app.getHttpServer())
        .put(`/orders/${orderId}`)
        .send({
          status: 'EXECUTED',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('EXECUTED');
        });
    });

    it('deve atualizar quantidade da ordem com sucesso', async () => {
      // Criar uma nova ordem para este teste
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'BUY',
          quantity: 10,
          price: 100.50,
        });
      const orderId = createResponse.body.id;

      return request(app.getHttpServer())
        .put(`/orders/${orderId}`)
        .send({
          quantity: 25,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.quantity).toBe(25);
        });
    });

    it('deve atualizar preço da ordem com sucesso', async () => {
      // Criar uma nova ordem para este teste
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'BUY',
          quantity: 10,
          price: 100.50,
        });
      const orderId = createResponse.body.id;

      return request(app.getHttpServer())
        .put(`/orders/${orderId}`)
        .send({
          price: 150.75,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.price).toBe(150.75);
        });
    });

    it('deve atualizar múltiplos campos da ordem com sucesso', async () => {
      // Criar uma nova ordem para este teste
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'BUY',
          quantity: 10,
          price: 100.50,
        });
      const orderId = createResponse.body.id;

      return request(app.getHttpServer())
        .put(`/orders/${orderId}`)
        .send({
          quantity: 50,
          price: 175.25,
          status: 'EXECUTED',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.quantity).toBe(50);
          expect(res.body.price).toBe(175.25);
          expect(res.body.status).toBe('EXECUTED');
        });
    });

    it('deve retornar erro 400 quando tenta atualizar ordem executada', () => {
      return request(app.getHttpServer())
        .put(`/orders/${executedOrderId}`)
        .send({
          quantity: 10,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'Não é possível atualizar uma ordem já executada ou cancelada',
          );
        });
    });

    it('deve retornar erro 400 quando tenta atualizar ordem cancelada', async () => {
      // Criar e cancelar uma ordem
      const cancelResponse = await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 3,
          type: 'BUY',
          quantity: 10,
          price: 100.50,
        });

      const canceledOrderId = cancelResponse.body.id;

      await prisma.order.update({
        where: { id: canceledOrderId },
        data: { status: 'CANCELED' },
      });

      return request(app.getHttpServer())
        .put(`/orders/${canceledOrderId}`)
        .send({
          quantity: 20,
        })
        .expect(400)
        .expect((res) => {
          expect(res.body.message).toContain(
            'Não é possível atualizar uma ordem já executada ou cancelada',
          );
        });
    });

    it('deve retornar erro 404 quando ordem não existe', () => {
      return request(app.getHttpServer())
        .put('/orders/00000000-0000-0000-0000-000000000000')
        .send({
          status: 'EXECUTED',
        })
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Ordem não encontrada');
        });
    });
  });

  describe('DELETE /orders/:id', () => {
    it('deve remover uma ordem com sucesso', async () => {
      // Criar uma ordem para remover
      const createResponse = await request(app.getHttpServer())
        .post('/orders')
        .send({
          userId: testUserId,
          assetId: 1,
          type: 'BUY',
          quantity: 10,
          price: 100.50,
        });

      const orderId = createResponse.body.id;

      return request(app.getHttpServer())
        .delete(`/orders/${orderId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.message).toContain('removida com sucesso');
        });
    });

    it('deve retornar erro 404 quando ordem não existe', () => {
      return request(app.getHttpServer())
        .delete('/orders/00000000-0000-0000-0000-000000000000')
        .expect(404)
        .expect((res) => {
          expect(res.body.message).toContain('Ordem não encontrada');
        });
    });
  });
});
