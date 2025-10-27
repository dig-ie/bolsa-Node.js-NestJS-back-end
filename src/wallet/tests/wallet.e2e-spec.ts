import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from 'src/app.module';

describe('Wallet (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      //aqui desabilitamos o JwtStrategy só para o teste
      .overrideProvider('JwtStrategy')
      .useValue({})
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/wallet (GET)', async () => {
    const res = await request(app.getHttpServer()).get('/wallet');
    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
