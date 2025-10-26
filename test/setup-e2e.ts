// Setup para testes E2E
import { config } from 'dotenv';

// Carrega variáveis de ambiente para testes
config({ path: '.env' });

// Define variáveis de ambiente específicas para testes se não estiverem definidas
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:bolsa2024!@localhost:5433/bolsa_sim?schema=public';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key';

// Configuração global para testes
beforeAll(async () => {
  // Setup inicial se necessário
});

afterAll(async () => {
  // Cleanup final se necessário
});
