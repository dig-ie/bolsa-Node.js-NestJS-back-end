@echo off
REM 🧪 Script de Teste Manual dos Guards (Windows)
REM Execute este script para testar o sistema de guards manualmente

setlocal enabledelayedexpansion

set BASE_URL=http://localhost:3000

echo ========================================
echo 🛡️  Testando Sistema de Guards
echo ========================================
echo.

REM 1. Testar rota pública (registro)
echo 1️⃣  Testando rota PUBLICA (POST /users)...
curl -X POST "%BASE_URL%/users" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test%RANDOM%@example.com\",\"password\":\"Test123!\",\"name\":\"Test User\"}"
echo.
echo ✅ Teste de registro concluido
echo.

REM 2. Fazer login
echo 2️⃣  Fazendo login (POST /auth/login)...
curl -X POST "%BASE_URL%/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@test.com\",\"password\":\"Admin123!\"}" ^
  -o login-response.json
echo.

REM Extrair token (simplificado para Windows)
echo ✅ Login concluido - verifique login-response.json para o token
echo.

REM 3. Testar rota protegida SEM token
echo 3️⃣  Testando rota protegida SEM token (GET /assets)...
curl -i "%BASE_URL%/assets"
echo.
echo ⚠️  Deve retornar 401 Unauthorized
echo.

REM 4. Instruções para teste manual com token
echo 4️⃣  Para testar COM token:
echo.
echo     1. Copie o access_token do arquivo login-response.json
echo     2. Execute: curl -H "Authorization: Bearer SEU_TOKEN" %BASE_URL%/assets
echo.

echo ========================================
echo ✅ Testes básicos concluídos!
echo ========================================
echo.

echo 📝 Próximos passos:
echo   - Execute os testes E2E: npm run test:e2e -- auth-guards
echo   - Veja a documentação: docs\GUARDS-ROADMAP.md
echo.

REM Limpar arquivo temporário
if exist login-response.json del login-response.json

pause

