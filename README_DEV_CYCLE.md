# 🔄 README - Ciclo de Desenvolvimento (Ambiente Dev)

Este guia descreve **como desenvolver, rebuildar e gerenciar o ambiente da API** usando o `docker-compose.dev.yml` — o único fluxo oficial e testado atualmente.

---

## 🚀 Iniciando o Projeto

### Primeira vez (setup completo)

```bash
# Opcional: limpar cache Docker
docker system prune -f

# Executar setup inicial

# Linux/Mac - BASH <-
./scripts/setup-dev.sh
# Windows - PowerShell
scripts\setup-dev.bat
```

### Desenvolvimento diário

```bash
# Subir ambiente (modo background)
docker compose -f docker-compose.dev.yml up -d
```

> 🔁 O hot reload cuida de alterações no código automaticamente.

---

## 🔄 Quando Rebuildar

Rebuild necessário **somente quando**:

### 🧱 1. Alterar dependências

```bash
# package.json ou pnpm-lock.yaml alterado
docker compose -f docker-compose.dev.yml up --build -d
```

### 🧩 2. Alterar Dockerfile

```bash
# Mudou Node version, pnpm ou build steps
docker compose -f docker-compose.dev.yml up --build -d
```

### 🧬 3. Alterar schema Prisma

```bash
docker compose -f docker-compose.dev.yml up --build -d
docker compose -f docker-compose.dev.yml exec api npx prisma migrate dev --name nome_da_migracao
```

---

## ⚡ Quando NÃO precisa rebuildar

Mudanças que **ativam hot reload automático**:

- Código em `src/**/*.ts`
- DTOs, Controllers, Services
- Arquivo de seed (`prisma/seed.ts`)

Se quiser forçar um reload manual:

```bash
docker compose -f docker-compose.dev.yml restart api
```

---

## 🎯 Fluxo Prático de Desenvolvimento

### 1. Subir o ambiente

```bash
docker compose -f docker-compose.dev.yml up -d
```

### 2. Alterar código

✅ Hot reload automático via `ts-node-dev`.

### 3. Alterar schema Prisma

```bash
docker compose -f docker-compose.dev.yml up --build -d
docker compose -f docker-compose.dev.yml exec api npx prisma migrate dev --name nome_da_migracao
```

### 4. Adicionar dependência

```bash
# 1. Edite package.json
# 2. Rebuild
docker compose -f docker-compose.dev.yml up --build -d
```

---

## 📋 Comandos Úteis

### Ver status dos containers

```bash
docker compose -f docker-compose.dev.yml ps
```

### Logs

```bash
# Todos os serviços
docker compose -f docker-compose.dev.yml logs -f

# Apenas API
docker compose -f docker-compose.dev.yml logs -f api

# Apenas banco
docker compose -f docker-compose.dev.yml logs -f db
```

### Restart

```bash
# Apenas API
docker compose -f docker-compose.dev.yml restart api

# Todos os serviços
docker compose -f docker-compose.dev.yml restart
```

### Parar ambiente

```bash
docker compose -f docker-compose.dev.yml down
```

### Resetar completamente (⚠️ apaga dados)

```bash
docker compose -f docker-compose.dev.yml down -v
```

### Prisma

```bash
# Abrir Prisma Studio
docker compose -f docker-compose.dev.yml exec api npx prisma studio

# Rodar migrations e seeds
docker compose -f docker-compose.dev.yml exec api npx prisma migrate deploy
docker compose -f docker-compose.dev.yml exec api npx prisma db seed
```

---

## 🌐 Serviços Disponíveis

| Serviço       | URL                   |
| ------------- | --------------------- |
| API           | http://localhost:3000 |
| Prisma Studio | http://localhost:5555 |
| PostgreSQL    | localhost:5433        |

---

## 👤 Usuários de Teste

Criados automaticamente pelo seed:

| Papel   | Email           | Senha    |
| ------- | --------------- | -------- |
| Admin   | admin@bolsa.com | admin123 |
| Usuário | test@bolsa.com  | test123  |

---

## ⚠️ Dicas Rápidas

1. 90% das vezes não é necessário rebuildar — o hot reload cuida do resto.
2. Sempre rebuild quando alterar **dependências** ou **schema Prisma**.
3. Use `down -v` apenas se quiser resetar o banco completamente.
4. Monitore logs com `docker compose logs -f`.
5. Prisma Studio é ótimo para inspecionar dados.

---

## 🐛 Troubleshooting

### API não inicia

```bash
docker compose -f docker-compose.dev.yml logs -f api
docker compose -f docker-compose.dev.yml restart api
```

### Banco não conecta

```bash
docker compose -f docker-compose.dev.yml ps
docker compose -f docker-compose.dev.yml logs -f db
docker compose -f docker-compose.dev.yml restart db
```

### Permissão negada (Linux/Mac)

```bash
chmod +x scripts/setup-dev.sh
```

### Resetar tudo

```bash
docker compose -f docker-compose.dev.yml down -v
docker system prune -a
./scripts/setup-dev.sh
```
