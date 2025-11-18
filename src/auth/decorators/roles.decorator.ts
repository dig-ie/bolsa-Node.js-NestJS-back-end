import { SetMetadata } from "@nestjs/common";

/**
 * 🎭 Roles Decorator
 *
 * Define quais ROLES (papéis/perfis) podem acessar uma rota.
 *
 * COMO FUNCIONA:
 * SetMetadata armazena as roles em um metadata com a chave "roles".
 * O RolesGuard lê esse metadata e verifica se o usuário tem uma das roles permitidas.
 *
 * EXEMPLO DE USO:
 *
 * @Controller('users')
 * export class UsersController {
 *   @Roles('ADMIN')  // Apenas admins podem deletar
 *   @Delete(':id')
 *   delete() { ... }
 *
 *   @Roles('ADMIN', 'USER')  // Admins OU users podem ver
 *   @Get(':id')
 *   findOne() { ... }
 *
 *   @Get('public')  // Qualquer usuário autenticado pode ver
 *   findPublic() { ... }  // (sem @Roles = qualquer role serve)
 * }
 *
 * IMPORTANTE:
 * - A verificação é feita com lógica OR (basta ter UMA das roles)
 * - Se não usar @Roles, qualquer usuário autenticado pode acessar
 * - Para usar @Roles, o usuário DEVE estar autenticado (JWT válido)
 *
 * @param roles - Uma ou mais roles permitidas (ex: 'ADMIN', 'USER', 'MANAGER')
 */
export const Roles = (...roles: string[]) => SetMetadata("roles", roles);
