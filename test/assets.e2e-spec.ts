import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/common/prisma.service';


describe('Assets - All Routes (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let assetId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    
    await app.init();
    
    await prismaService.assets.deleteMany();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /assets - Create Asset', () => {
    it('should create a new asset', async () => {
      const newAsset = {
        name: 'Petrobras',
        symbol: 'PETR4',
        price: 25.50
      };

      const response = await request(app.getHttpServer())
        .post('/assets')
        .send(newAsset)
        .expect(201);

      assetId = response.body.id;

      expect(response.body.name).toBe('Petrobras');
      expect(response.body.symbol).toBe('PETR4');
      expect(response.body.price).toBe(25.5);
      expect(response.body.isActive).toBe(true);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('createdAt');
    });

    it('should not create asset with duplicate symbol', async () => {
      await request(app.getHttpServer())
        .post('/assets')
        .send({
          name: 'Petrobras',
          symbol: 'PETR4',
          price: 25.50
        });

      await request(app.getHttpServer())
        .post('/assets')
        .send({
          name: 'Another Company',
          symbol: 'PETR4',
          price: 30.00
        })
        .expect(409);
    });
  });

  describe('GET /assets - List Assets', () => {
    it('should return empty list initially', async () => {
      const response = await request(app.getHttpServer())
        .get('/assets')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return created assets', async () => {
      await request(app.getHttpServer())
        .post('/assets')
        .send({ name: 'Petrobras', symbol: 'PETR4', price: 25.50 });

      await request(app.getHttpServer())
        .post('/assets')
        .send({ name: 'Vale', symbol: 'VALE3', price: 45.75 });

      const response = await request(app.getHttpServer())
        .get('/assets')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('symbol');
      expect(response.body[0]).toHaveProperty('price');
    });
  });

  describe('GET /assets/:id - Get Asset by ID', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/assets')
        .send({ name: 'Petrobras', symbol: 'PETR4', price: 25.50 });
      
      assetId = response.body.id;
    });

    it('should return asset by ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/assets/${assetId}`)
        .expect(200);

      expect(response.body.id).toBe(assetId);
      expect(response.body.name).toBe('Petrobras');
      expect(response.body.symbol).toBe('PETR4');
      expect(response.body.price).toBe(25.5);
    });

    it('should return 404 for non-existent ID', async () => {
      await request(app.getHttpServer())
        .get('/assets/999')
        .expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app.getHttpServer())
        .get('/assets/abc')
        .expect(400);
    });
  });

  describe('PUT /assets/:id - Update Asset', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/assets')
        .send({ name: 'Petrobras', symbol: 'PETR4', price: 25.50 });
      
      assetId = response.body.id;
    });

    it('should update asset completely', async () => {
      const updateData = {
        name: 'Updated Petrobras',
        symbol: 'PETR5',
        price: 30.75
      };

      const response = await request(app.getHttpServer())
        .put(`/assets/${assetId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.id).toBe(assetId);
      expect(response.body.name).toBe('Updated Petrobras');
      expect(response.body.symbol).toBe('PETR5');
      expect(response.body.price).toBe(30.75);
    });

    it('should update only the name', async () => {
      const response = await request(app.getHttpServer())
        .put(`/assets/${assetId}`)
        .send({ name: 'New Name' })
        .expect(200);

      expect(response.body.name).toBe('New Name');
      expect(response.body.symbol).toBe('PETR4');
      expect(response.body.price).toBe(25.5);
    });

    it('should return 404 for non-existent ID', async () => {
      await request(app.getHttpServer())
        .put('/assets/999')
        .send({ name: 'Test' })
        .expect(404);
    });
  });

  describe('DELETE /assets/:id - Delete Asset', () => {
    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/assets')
        .send({ name: 'Petrobras', symbol: 'PETR4', price: 25.50 });
      
      assetId = response.body.id;
    });

    it('should delete asset (soft delete)', async () => {
      await request(app.getHttpServer())
        .delete(`/assets/${assetId}`)
        .expect(204);

      const response = await request(app.getHttpServer())
        .get('/assets')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return 404 for non-existent ID', async () => {
      await request(app.getHttpServer())
        .delete('/assets/999')
        .expect(404);
    });

    it('should return 400 for invalid ID', async () => {
      await request(app.getHttpServer())
        .delete('/assets/abc')
        .expect(400);
    });
  });
});