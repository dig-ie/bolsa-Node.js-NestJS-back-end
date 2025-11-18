import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

/**
 * 👮 Roles Guard
 *
 * Este guard é responsável pela AUTORIZAÇÃO (verificar O QUE o usuário pode fazer).
 * Ele verifica se o usuário autenticado possui as roles (papéis) necessárias.
 *
 * IMPORTANTE:
 * - Este guard deve ser executado APÓS o JwtAuthGuard
 * - Assume que req.user já foi populado pela JwtStrategy
 * - Se nenhuma role for especificada, permite acesso (rota protegida apenas por autenticação)
 *
 * EXEMPLO DE USO:
 * @Roles('ADMIN')           // Apenas admins
 * @Roles('ADMIN', 'USER')   // Admins OU usuários comuns
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * 🎯 Determina se a requisição pode prosseguir
   *
   * @param context - Contexto de execução da requisição
   * @returns true se autorizado, false caso contrário
   */
  canActivate(context: ExecutionContext): boolean {
    // 🔍 Extrai as roles requeridas do metadata definido por @Roles()
    // getAllAndOverride busca primeiro no método, depois na classe
    const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);

    // ✅ Se não há roles requeridas, permite acesso
    // (a rota está protegida apenas por autenticação, não por role)
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 📦 Extrai o objeto request do contexto HTTP
    const request = context.switchToHttp().getRequest();

    // 👤 Pega o usuário do request (foi anexado pela JwtStrategy)
    const user = request.user;

    // 🚫 Se não há usuário (não deveria acontecer se JwtAuthGuard passou)
    if (!user || !user.role) {
      return false;
    }

    // ✅ Verifica se a role do usuário está na lista de roles permitidas
    // some() retorna true se pelo menos uma condição for verdadeira
    return requiredRoles.some((role) => user.role === role);
  }
}
