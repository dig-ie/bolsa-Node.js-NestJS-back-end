// Setup para testes E2E
import { config } from 'dotenv';

// Carrega variáveis de ambiente para testes
config({ path: '.env' });

// Define variáveis de ambiente específicas para testes se não estiverem definidas
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.DATABASE_URL =
  process.env.DATABASE_URL
  || 'postgresql://user:bolsa2024!@db:5432/bolsa_sim?schema=public';

// adiciona estes dois para compatibilizar com test/db.e2e-spec.ts
process.env.DB_HOST = process.env.DB_HOST || 'db';
process.env.DB_PORT = process.env.DB_PORT || '5432';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key';

// Configuração global para testes
beforeAll(async () => {
  // Setup inicial se necessário
});

afterAll(async () => {
  // Cleanup final se necessário
});
