# 🔄 README - Ciclo de Desenvolvimento

Este documento explica como trabalhar com o projeto durante o desenvolvimento, quando rebuildar imagens e como gerenciar o ambiente Docker.

## 🚀 Iniciando o Projeto

# Limpar cache do Docker (se for o caso)
docker system prune -f

### Primeira vez (PC novo)

```bash
# Windows (powershell)
scripts\setup-dev.bat
# Linux/Mac (se estiver no terminal bash)
./scripts/setup-dev.sh
```

### Desenvolvimento diário

```bash
# Se containers estão parados
docker-compose -f docker-compose.dev.yml up -d

# Se já estão rodando, não precisa fazer nada!
```

## 🔄 Quando Rebuildar vs Quando Apenas Restart

### ✅ QUANDO PRECISA REBUILDAR (`docker-compose up --build -d`):

**1. Mudanças no Dockerfile**

```dockerfile
FROM node:20  # ← mudou versão
RUN npm install -g pnpm@latest  # ← mudou comando
```

**2. Mudanças nas dependências**

```bash
# Arquivos alterados:
package.json          # ← adicionou/removeu dependência
package-lock.json     # ← versões de dependências
pnpm-lock.yaml        # ← lock file do pnpm
```

**3. Mudanças no Prisma Schema**

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("user")
  // ← ADICIONOU NOVO CAMPO
  phone     String?  // ← PRECISA REBUILDAR
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**4. Mudanças nos scripts de build**

```json
{
  "scripts": {
    "start:dev": "ts-node-dev --respawn --transpile-only src/main.ts",
    "build": "nest build", // ← mudou comando de build
    "start:prod": "node dist/main.js"
  }
}
```

### ✅ QUANDO NÃO PRECISA REBUILDAR (apenas restart)

**1. Mudanças no código da aplicação**

```typescript
// Qualquer arquivo .ts na pasta src/
src / main.ts;
src / app.module.ts;
src / users / users.service.ts;
src / assets / assets.controller.ts;
// etc... (hot reload automático)
```

**2. Mudanças nos DTOs**

```typescript
// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  email: string;
  password: string;
  name?: string;
  // ← adicionou novo campo
  phone?: string; // ← NÃO PRECISA REBUILDAR
}
```

**3. Mudanças nos controllers/services**

```typescript
// src/users/users.controller.ts
@Controller("users")
export class UsersController {
  // ← adicionou nova rota
  @Get("profile")
  getProfile() {
    return "profile";
  }
}
```

**4. Mudanças no seed**

```typescript
// prisma/seed.ts
// ← adicionou novos usuários de teste
// ← mudou dados de seed
```

## 🎯 Fluxo Prático de Desenvolvimento

### 1. Iniciar ambiente

```bash
# Se containers estão parados
docker-compose -f docker-compose.dev.yml up -d

# Se já estão rodando, não precisa fazer nada!
```

### 2. Durante o desenvolvimento

- ✅ **Alterar código** → Hot reload automático (ts-node-dev)
- ✅ **Alterar DTOs/Controllers** → Hot reload automático
- ✅ **Alterar seed** → Restart: `docker-compose restart api`

### 3. Quando adicionar dependência

```bash
# 1. Adicione no package.json
# 2. Rebuilde
docker-compose -f docker-compose.dev.yml up --build -d
```

### 4. Quando alterar schema Prisma

```bash
# 1. Altere prisma/schema.prisma
# 2. Rebuilde
docker-compose -f docker-compose.dev.yml up --build -d
# 3. Crie nova migração
docker-compose -f docker-compose.dev.yml exec api npx prisma migrate dev --name nome_da_migracao
```

## 📋 Comandos Úteis

### Verificar status

```bash
docker-compose -f docker-compose.dev.yml ps
```

### Ver logs

```bash
# Todos os serviços
docker-compose -f docker-compose.dev.yml logs -f

# Apenas API
docker-compose -f docker-compose.dev.yml logs -f api

# Apenas banco
docker-compose -f docker-compose.dev.yml logs -f db
```

### Restart

```bash
# Apenas API
docker-compose -f docker-compose.dev.yml restart api

# Todos os serviços
docker-compose -f docker-compose.dev.yml restart
```

### Parar ambiente

```bash
# Parar containers (mantém volumes)
docker-compose -f docker-compose.dev.yml down

# Parar e remover volumes (CUIDADO: apaga dados!)
docker-compose -f docker-compose.dev.yml down -v
```

### Comandos Prisma

```bash
# Acessar container da API
docker-compose -f docker-compose.dev.yml exec api sh

# Executar comandos Prisma
docker-compose -f docker-compose.dev.yml exec api npx prisma studio
docker-compose -f docker-compose.dev.yml exec api npx prisma migrate dev
docker-compose -f docker-compose.dev.yml exec api npx prisma db seed
```

## 🎯 Resumo Prático

| **Situação**            | **Ação**           | **Comando**                    |
| ----------------------- | ------------------ | ------------------------------ |
| **Primeira vez**        | Setup completo     | `./scripts/setup-dev.sh`       |
| **Código da aplicação** | Nada (hot reload)  | -                              |
| **Nova dependência**    | Rebuild            | `docker-compose up --build -d` |
| **Schema Prisma**       | Rebuild + migração | `docker-compose up --build -d` |
| **Containers parados**  | Start              | `docker-compose up -d`         |
| **Problemas**           | Restart            | `docker-compose restart`       |
| **Resetar banco**       | Down + volumes     | `docker-compose down -v`       |

## 🌐 Serviços Disponíveis

Após iniciar o ambiente:

- **API**: http://localhost:3000
- **Prisma Studio**: http://localhost:5555
- **PostgreSQL**: localhost:5433

## 👤 Usuários de Teste

Criados automaticamente pelo seed:

- **Admin**: `admin@bolsa.com` / `admin123`
- **Usuário**: `test@bolsa.com` / `test123`

## ⚠️ Dicas Importantes

1. **90% do tempo** você só vai alterar código e o hot reload cuida de tudo
2. **Sempre rebuild** quando alterar dependências ou schema Prisma
3. **Use `down -v`** apenas quando quiser resetar completamente o banco
4. **Monitore os logs** se algo não estiver funcionando
5. **Prisma Studio** é ótimo para visualizar e editar dados

## 🐛 Troubleshooting

### API não inicia

```bash
# Ver logs
docker-compose -f docker-compose.dev.yml logs -f api

# Restart
docker-compose -f docker-compose.dev.yml restart api
```

### Banco não conecta

```bash
# Verificar se banco está rodando
docker-compose -f docker-compose.dev.yml ps

# Ver logs do banco
docker-compose -f docker-compose.dev.yml logs -f db

# Restart do banco
docker-compose -f docker-compose.dev.yml restart db
```

### Problemas de permissão (Linux/Mac)

```bash
# Dar permissão de execução ao script
chmod +x scripts/setup-dev.sh
```

### Resetar tudo

```bash
# Para tudo e remove volumes
docker-compose -f docker-compose.dev.yml down -v

# Remove imagens antigas
docker system prune -a

# Executa setup novamente
./scripts/setup-dev.sh
```
