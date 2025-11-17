import { Injectable, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

/**
 * 🔐 JWT Authentication Guard
 *
 * Este guard é responsável pela AUTENTICAÇÃO (verificar SE o usuário está logado).
 * Ele estende o AuthGuard do Passport que automaticamente:
 * 1. Extrai o token do header Authorization
 * 2. Valida o token usando a JwtStrategy
 * 3. Anexa os dados do usuário em req.user
 *
 * FUNCIONALIDADE ADICIONAL:
 * - Permite marcar rotas como públicas usando o decorator @Public()
 * - Rotas públicas pulam a autenticação
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * 🧠 Método chamado ANTES de validar o token
   *
   * ExecutionContext: Contexto da requisição que permite acessar:
   * - getHandler(): método do controller sendo chamado
   * - getClass(): classe do controller
   * - switchToHttp().getRequest(): objeto request do Express
   */
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 🔍 Verifica se a rota está marcada com @Public()
    // getAllAndOverride busca o metadata em dois lugares (ordem de prioridade):
    // 1. No método (handler) - exemplo: @Get() @Public()
    // 2. Na classe (controller) - exemplo: @Controller() @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>("isPublic", [
      context.getHandler(),
      context.getClass(),
    ]);

    // ✅ Se a rota é pública, permite acesso sem autenticação
    if (isPublic) {
      return true;
    }

    // 🔐 Se não é pública, delega para o AuthGuard do Passport
    // que irá validar o JWT usando a JwtStrategy
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      return null; // vai gerar 401 automaticamente
    }
    return user;
  }
}
