import { SetMetadata } from "@nestjs/common";

/**
 * 🌍 Public Decorator
 *
 * Marca uma rota como PÚBLICA (acessível sem autenticação).
 *
 * COMO FUNCIONA:
 * SetMetadata cria um metadata com a chave "isPublic" e valor true.
 * O JwtAuthGuard verifica esse metadata e pula a autenticação se for true.
 *
 * EXEMPLO DE USO:
 *
 * @Controller('auth')
 * export class AuthController {
 *   @Public()  // Esta rota não precisa de autenticação
 *   @Post('login')
 *   login() { ... }
 *
 *   @Post('change-password')  // Esta rota PRECISA de autenticação
 *   changePassword() { ... }
 * }
 *
 * PODE SER APLICADO EM:
 * - Métodos individuais (mais comum)
 * - Classes inteiras (todos os métodos ficam públicos)
 */
export const Public = () => SetMetadata("isPublic", true);
