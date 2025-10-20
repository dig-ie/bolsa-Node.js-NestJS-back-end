# 📘 Guia Rápido — Prisma + PostgreSQL
Este projeto usa **Prisma ORM** com **PostgreSQL**.  
Aqui está o fluxo básico para mexer no banco **sem dor de cabeça**.
---
## ⚙️ 0.0 (observação para entendimento) O comando que gera o client
Quando você roda:
```bash
npx prisma generate
```
ou quando você roda uma migração:
```bash
npx prisma migrate dev
```
o Prisma cria o **Prisma Client** (em `node_modules/@prisma/client`).
Esse client contém uma classe `PrismaClient` com propriedades baseadas em cada `model` que existe no schema.
No exemplo acima, como existe `model User`, o client vai gerar algo equivalente a:
```ts
class PrismaClient {
  user: {
    create(...)
    findMany(...)
    findUnique(...)
    update(...)
    delete(...)
    // etc
  }
  // Se tivesse outro model:
  // post: { create, findMany, ... }
}
```

## 🚀 1. Primeira vez no projeto

```bash
pnpm install
npx prisma migrate dev
```

Isso aplica todas as migrations no seu banco local e gera o Prisma Client.

---

## 🛠️ 2. Quando você CRIAR ou ALTERAR tabelas

1. Edite o `prisma/schema.prisma`.
2. Gere a migration + aplique no banco local:
   ```bash
   npx prisma migrate dev --name <nome_da_mudanca>
   ```
   Exemplo:
   ```bash
   npx prisma migrate dev --name create_users
   ```
3. Commit + push (inclua a pasta `prisma/migrations/` no git).

---

## 📥 3. Quando você der `git pull`

Se outro dev criou migration, rode:

```bash
npx prisma migrate dev
```

Isso aplica as migrations pendentes no seu banco local.

---

## 🌐 4. Produção

No deploy, **nunca use `dev`**.  
Use:

```bash
npx prisma migrate deploy
```

Isso aplica todas as migrations já criadas/testadas.

---

## 🧾 Resumo rápido

- **`migrate dev --name`** → cria + aplica + atualiza client (**desenvolvimento**)
- **`migrate dev`** → aplica migrations pendentes (**após git pull**)
- **`migrate deploy`** → aplica migrations em **produção**

---

## ✅ Dicas

- Sempre descreva bem o nome da migration (`create_orders`, `add_price_to_assets`).
- Nunca edite migrations antigas já aplicadas — crie uma nova.
- `.env` define a conexão com o banco (`DATABASE_URL`).
