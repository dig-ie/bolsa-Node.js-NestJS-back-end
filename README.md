# Bolsa API - Arquitetura Monolítica Modular

## Link para o Front e readme geral de explicação sobre a proposta do projeto: 
- https://github.com/dig-ie/bolsa-Next.js-React.js-front-end

## Estrutura de Pastas

```
bolsa-api-nest/
├── src/
│   ├── app.module.ts
│   ├── users/
│   ├── assets/
│   ├── wallet/
│   ├── orders/
│   ├── simulation/
│   ├── auth/
│   └── common/
├── test/
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.prod.yml
├── .env
├── package.json
└── pnpm-lock.yaml
```
# 🧩 Módulos Principais — Valorim API (Arquitetura Modular)
---

## 💼 `wallet/` (antigo `portfolio/`)

### 📘 O que é  
Gerencia **os ativos que o usuário possui** dentro da simulação — quantidades, preços de compra, valor atual e lucro/prejuízo acumulado.

### 🧠 No contexto do Valorim  
- É a **carteira simulada** do usuário, mostrando o resultado consolidado das suas operações.  
- Reúne dados dos módulos `orders` e `assets`.  
- Serve de base para o dashboard do usuário e relatórios de desempenho.  

### ⚙️ Responsabilidades
- Calcular **saldo total**, **variação acumulada** e **rentabilidade**.  
- Armazenar o **estado atual** da carteira simulada.  
- Expor endpoints como:
  - `GET /wallet` → Retorna todos os ativos da carteira.  
  - `GET /wallet/summary` → Mostra saldo total, lucro/prejuízo e evolução.

### 💡 Em resumo  
> É o módulo que **agrega e resume** tudo o que o usuário possui na simulação.  
> Exemplo: “O usuário possui 3 TEC11 e 5 FINV3, lucro total: +12%.”

---

## 🛒 `orders/`

### 📘 O que é  
Gerencia todas as **ordens de compra e venda** criadas pelo usuário dentro do ambiente simulado.

### 🧠 No contexto do Valorim  
- Cada ordem representa uma ação individual do usuário (ex: “comprar 5 TEC11 a R$120”).  
- As ordens alimentam diretamente a **carteira (`wallet`)** e o **histórico**.  
- É o módulo responsável por **registrar as transações** simuladas, mesmo que não envolvam dinheiro real.

### ⚙️ Responsabilidades
- Criar e armazenar **ordens de compra e venda**.  
- Validar **saldo disponível** e **quantidade de ativos**.  
- Registrar **timestamp**, **tipo de operação** e **preço executado**.  
- Alimentar o histórico e atualizar o módulo `wallet`.

### 💡 Em resumo  
> São os **movimentos da simulação** — cada ação que o usuário executa.  
> Exemplo: “Comprar 10 ações de TEC11” ou “Vender 5 ações de FINV3”.

---

## 📊 `simulation/`

### 📘 O que é  
Define e controla o **comportamento do mercado fictício** — os preços dos ativos, suas variações e regras de oscilação.  

Em APIs de trading, esse módulo costuma ser responsável por simular ticks em tempo real, mas no **Valorim** (simulação educacional) ele tem um papel **mais conceitual e orquestrador**.

### 🧠 No contexto do Valorim  
- É o **motor de simulação de mercado** que define como os preços dos ativos mudam ao longo do tempo.  
- Pode gerar cotações fictícias de forma programada (ex: variação aleatória a cada minuto).  
- Ou consumir uma **API externa de dados de mercado**, apenas para leitura e adaptação educacional.  
- Serve como **camada de integração, cache e controle de regras** sobre as cotações exibidas no front-end.

### ⚙️ Responsabilidades
- Gerar ou atualizar **cotações simuladas** periodicamente.  
- Definir regras de oscilação (ex: variação entre -2% e +2%).  
- Registrar as cotações em banco (para gráficos e histórico).  
- Expor endpoints como:
  - `GET /simulation/assets` → Lista de ativos com preço atual e variação.  
  - `GET /simulation/:id` → Detalhes da simulação (modo, data, etc.).  

### 💡 Em resumo  
> O módulo que **gera ou orquestra os dados de mercado fictício**.  
> Ele fornece o “cenário” em que os usuários interagem.  

---

## 🔗 Relação entre os módulos

```mermaid
graph LR
A[simulation] --> B[assets]
B --> C[orders]
C --> D[wallet]
```

- `simulation` → Gera o ambiente e os preços fictícios.  
- `orders` → Executa as ações do usuário dentro desse ambiente.  
- `wallet` → Consolida o resultado de todas as ordens.

---

## 🧭 Integração com APIs Externas

Mesmo consumindo dados de uma **API externa**, o módulo `simulation` **ainda é necessário**, pois ele:
- controla a lógica interna da simulação (ex: modo, regras, duração);  
- atua como **cache local** para evitar depender de chamadas externas em tempo real;  
- mantém as regras pedagógicas do Valorim (por exemplo, simular comportamento de mercado, não o mercado real).

---

## ✅ Resumo Final acerca dos 3 módulos principais descritos acima

| Módulo | Responsabilidade | Tipo | Exemplo |
|---------|------------------|------|----------|
| `wallet` | Armazena e calcula a carteira do usuário | Estado do usuário | “O usuário possui 10 ações de TEC11 e 3 de VLR3.” |
| `orders` | Registra as ordens de compra e venda | Ação do usuário | “Comprar 5 ações de TEC11 a R$100.” |
| `simulation` | Controla o comportamento do mercado fictício | Ambiente do sistema | “TEC11 sobe 1.2% em 24h.” |

## Organização Modular (referindo-se a todos os módulos)

- Cada domínio (ex: `users`, `assets`, `orders`) tem seu próprio módulo, controller, service e modelos.
- Todos os módulos rodam juntos em uma única aplicação backend.
- Banco de dados compartilhado entre os módulos.

## Setup Docker (Desenvolvimento e Produção)

### 1. Instale o Docker

Se você nunca usou Docker, acesse https://www.docker.com/get-started/ e siga as instruções para baixar e instalar o Docker Desktop no seu sistema (Windows, Mac ou Linux). Após instalar, abra o Docker Desktop para garantir que está rodando.

### 2. Setup Rápido (Recomendado)

**Windows:**

```cmd
scripts\setup-dev.bat
```

**Linux/Mac:**

```bash
chmod +x scripts/setup-dev.sh
./scripts/setup-dev.sh
```

Este script irá:

- Criar o arquivo `.env` automaticamente
- Parar containers existentes
- Iniciar o banco de dados e API
- Aplicar as migrações do Prisma
- Verificar se tudo está funcionando

### 3. Setup Manual

Se preferir fazer manualmente:

1. **Crie o arquivo `.env`:**

```bash
# Configurações do Banco de Dados
DATABASE_URL="postgresql://user:bolsa2024!@localhost:5433/bolsa_sim?schema=public"

# Configurações da Aplicação
NODE_ENV=development
PORT=3000

# Configurações do Prisma
PRISMA_GENERATE_DATAPROXY=false
```

2. **Inicie os containers:**

```bash
docker-compose -f docker-compose.dev.yml up --build -d
```

3. **Aplique as migrações:**

```bash
docker-compose -f docker-compose.dev.yml exec api npx prisma migrate deploy
```

### 4. Verificação

- **API:** http://localhost:3000
- **Prisma Studio:** http://localhost:5555 (interface gráfica do banco)
- **Banco:** localhost:5433 (user: `user`, password: `bolsa2024!`, database: `bolsa_sim`)

### 5. Dados de Teste

O sistema cria automaticamente usuários de teste:

- **Admin:** admin@bolsa.com / admin123
- **Usuário:** test@bolsa.com / test123

### 6. Comandos Úteis

```bash

# Entrypoints do projeto:
# Windows
scripts/setup-dev.bat
# Linux/Mac
scripts/setup-dev.sh


# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Parar tudo
docker-compose -f docker-compose.dev.yml down

# Resetar banco (remove todos os dados)
docker-compose -f docker-compose.dev.yml down -v

# Acessar container da API
docker-compose -f docker-compose.dev.yml exec api sh

# Executar comandos Prisma
docker-compose -f docker-compose.dev.yml exec api npx prisma studio

# Abrir Prisma Studio (se não estiver rodando)
docker-compose -f docker-compose.dev.yml up prisma-studio

# Executar seed manualmente
docker-compose -f docker-compose.dev.yml exec api npx prisma db seed


```

---

### Sobre arquivos `.keep`

Em alguns diretórios do projeto você encontrará arquivos chamados `.keep`. Eles existem apenas para garantir que a pasta seja versionada no Git, mesmo se estiver vazia. O arquivo `.keep` não afeta o funcionamento do sistema e pode ser ignorado por quem for usar ou desenvolver o projeto.

- **Desenvolvimento:**
  ```sh
  docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
  ```
- **Produção:**
  ```sh
  docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
  ```

---

> Arquitetura modular, organizada e fácil de escalar. Ideal para times pequenos e projetos em evolução.
