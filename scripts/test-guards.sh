#!/bin/bash

# 🧪 Script de Teste Manual dos Guards
# Execute este script para testar o sistema de guards manualmente

set -e

BASE_URL="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}🛡️  Testando Sistema de Guards${NC}"
echo -e "${BLUE}========================================${NC}\n"

# 1. Testar rota pública (registro)
echo -e "${BLUE}1️⃣  Testando rota PÚBLICA (POST /users)...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "Test123!",
    "name": "Test User"
  }')

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Registro funcionou (rota pública)${NC}\n"
else
  echo -e "${RED}❌ Erro no registro${NC}\n"
  exit 1
fi

# 2. Fazer login
echo -e "${BLUE}2️⃣  Fazendo login (POST /auth/login)...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "Admin123!"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Erro ao obter token${NC}"
  echo -e "${RED}Certifique-se de que existe um usuário admin@test.com no banco${NC}\n"
  exit 1
fi

echo -e "${GREEN}✅ Login bem-sucedido${NC}"
echo -e "Token: ${TOKEN:0:20}...\n"

# 3. Testar rota protegida SEM token (deve falhar)
echo -e "${BLUE}3️⃣  Testando rota protegida SEM token (GET /assets)...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/assets")

if [ "$HTTP_CODE" -eq 401 ]; then
  echo -e "${GREEN}✅ Bloqueado corretamente (401 Unauthorized)${NC}\n"
else
  echo -e "${RED}❌ Deveria retornar 401, mas retornou $HTTP_CODE${NC}\n"
fi

# 4. Testar rota protegida COM token (deve funcionar)
echo -e "${BLUE}4️⃣  Testando rota protegida COM token (GET /assets)...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/assets")

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✅ Acesso permitido com token (200 OK)${NC}\n"
else
  echo -e "${RED}❌ Deveria retornar 200, mas retornou $HTTP_CODE${NC}\n"
fi

# 5. Testar rota do perfil
echo -e "${BLUE}5️⃣  Testando perfil do usuário (GET /auth/profile)...${NC}"
PROFILE_RESPONSE=$(curl -s \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/auth/profile")

echo "$PROFILE_RESPONSE" | grep -q "email"
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Perfil obtido com sucesso${NC}\n"
else
  echo -e "${RED}❌ Erro ao obter perfil${NC}\n"
fi

# 6. Testar @CurrentUser (GET /users/me)
echo -e "${BLUE}6️⃣  Testando decorator @CurrentUser (GET /users/me)...${NC}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Bearer $TOKEN" \
  "$BASE_URL/users/me")

if [ "$HTTP_CODE" -eq 200 ]; then
  echo -e "${GREEN}✅ @CurrentUser funcionando (200 OK)${NC}\n"
else
  echo -e "${RED}❌ Erro no @CurrentUser (HTTP $HTTP_CODE)${NC}\n"
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ Testes concluídos!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "${BLUE}📝 Próximos passos:${NC}"
echo -e "  - Execute os testes E2E: ${GREEN}npm run test:e2e -- auth-guards${NC}"
echo -e "  - Veja a documentação: ${GREEN}docs/GUARDS-ROADMAP.md${NC}"
echo -e "  - Experimente com diferentes roles e permissões\n"

