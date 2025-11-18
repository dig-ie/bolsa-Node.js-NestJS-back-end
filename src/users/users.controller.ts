import { Body, Controller, Post, Get, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Public } from "../auth/decorators/public.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";

/**
 * 👥 Users Controller
 *
 * Gerencia usuários da plataforma.
 *
 * NÍVEIS DE ACESSO:
 * - POST /users (registro): Público (qualquer pessoa pode se registrar)
 * - GET /users (listar): Apenas ADMIN
 * - GET /users/me (perfil próprio): Qualquer usuário autenticado
 * - GET /users/:id (perfil específico): Apenas ADMIN
 * - DELETE /users/:id: Apenas ADMIN
 *
 * DEMONSTRAÇÃO DIDÁTICA:
 * Este controller mostra os 3 níveis de acesso:
 * 1. Público (@Public)
 * 2. Autenticado (sem decorator = qualquer role)
 * 3. Restrito por role (@Roles)
 */
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 🌍 Registrar novo usuário - Rota PÚBLICA
   * @Public() permite acesso sem autenticação
   * Necessário para que novos usuários possam se cadastrar
   */
  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  /**
   * 👮 Listar todos os usuários - Apenas ADMIN
   * Informação sensível que só administradores devem ver
   */
  @Roles("ADMIN")
  @Get()
  async findAll(@CurrentUser() admin: any) {
    console.log(`Admin ${admin.email} está listando todos os usuários`);
    return this.usersService.findAll();
  }

  /**
   * 👤 Ver próprio perfil - Qualquer usuário autenticado
   * Sem @Roles() = qualquer role pode acessar
   * Usa @CurrentUser() para pegar ID do usuário logado
   */
  @Get("me")
  async getMyProfile(@CurrentUser("userId") userId: string) {
    return this.usersService.findOne(userId);
  }

  /**
   * 👮 Ver perfil de outro usuário - Apenas ADMIN
   * Administradores podem ver perfil de qualquer usuário
   */
  @Roles("ADMIN")
  @Get(":id")
  async findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  /**
   * 👮 Deletar usuário - Apenas ADMIN
   */
  @Roles("ADMIN")
  @Delete(":id")
  async remove(@Param("id") id: string, @CurrentUser() admin: any) {
    console.log(`Admin ${admin.email} está deletando usuário ${id}`);
    return this.usersService.remove(id);
  }
}
