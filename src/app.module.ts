import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AssetsModule } from "./assets/assets.module";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { RolesGuard } from "./auth/guards/roles.guard";

/**
 * 🏛️ App Module - Módulo principal da aplicação
 *
 * GUARDS GLOBAIS CONFIGURADOS:
 *
 * 1. JwtAuthGuard (primeira linha de defesa)
 *    - Protege TODAS as rotas por padrão
 *    - Rotas públicas devem usar @Public()
 *    - Valida tokens JWT automaticamente
 *
 * 2. RolesGuard (segunda linha de defesa)
 *    - Verifica permissões baseadas em roles
 *    - Usa @Roles('ADMIN', 'USER') para definir quem pode acessar
 *    - Se não houver @Roles, qualquer usuário autenticado pode acessar
 *
 * ORDEM DE EXECUÇÃO:
 * Request → JwtAuthGuard → RolesGuard → Controller
 *           (autentica)    (autoriza)
 *
 * SEGURANÇA POR PADRÃO:
 * - Toda nova rota é automaticamente protegida
 * - Evita esquecimento de adicionar guards manualmente
 * - Abordagem "secure by default, open by exception"
 */
@Module({
  imports: [AssetsModule],
  controllers: [AppController],
  providers: [
    AppService,
    // 🔐 Registra JwtAuthGuard como guard global
    // Será executado em TODAS as requisições
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // 👮 Registra RolesGuard como guard global
    // Será executado APÓS o JwtAuthGuard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
