/**
 * 🔧 Configuração de Variáveis de Ambiente para Testes E2E
 *
 * Este arquivo é executado ANTES de todos os testes E2E.
 * Configura as variáveis de ambiente necessárias para conectar ao banco de dados.
 *
 * IMPORTANTE:
 * - O banco roda no Docker na porta 5433 (mapeada de 5432)
 * - Os testes rodam no host (localhost), não dentro do Docker
 * - Por isso usamos localhost:5433 em vez de db:5433
 */

process.env.DATABASE_URL =
  "postgresql://user:bolsa2024!@localhost:5433/bolsa_sim?schema=public";
process.env.JWT_SECRET = "test-secret-key-for-guards";
process.env.JWT_EXPIRES_IN = "1h";

