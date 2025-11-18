import { createParamDecorator, ExecutionContext } from "@nestjs/common";

/**
 * 👤 Current User Decorator
 *
 * Extrai os dados do usuário autenticado diretamente nos parâmetros do método.
 *
 * COMO FUNCIONA:
 * 1. O JwtAuthGuard valida o token
 * 2. A JwtStrategy anexa os dados do usuário em req.user
 * 3. Este decorator extrai req.user e injeta nos parâmetros do método
 *
 * EXEMPLO DE USO:
 *
 * @Controller('profile')
 * export class ProfileController {
 *   @Get('me')
 *   getProfile(@CurrentUser() user: any) {
 *     // user contém: { userId, email, role }
 *     return { message: `Olá, ${user.email}!` };
 *   }
 *
 *   @Get('my-id')
 *   getMyId(@CurrentUser('userId') userId: string) {
 *     // Extrai apenas o userId
 *     return { id: userId };
 *   }
 * }
 *
 * VANTAGENS:
 * - Código mais limpo (sem precisar usar @Req() e acessar req.user)
 * - Type-safe (pode tipar o usuário)
 * - Pode extrair propriedades específicas
 *
 * @param data - (Opcional) Propriedade específica para extrair (ex: 'userId', 'email')
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    // 📦 Extrai o objeto request do contexto HTTP
    const request = context.switchToHttp().getRequest();

    // 👤 Pega o usuário do request (anexado pela JwtStrategy)
    const user = request.user;

    // 🎯 Se data foi especificado, retorna apenas essa propriedade
    // Exemplo: @CurrentUser('email') => retorna apenas user.email
    if (data) {
      return user?.[data];
    }

    // 📦 Se data não foi especificado, retorna o usuário completo
    // Exemplo: @CurrentUser() => retorna { userId, email, role }
    return user;
  }
);
