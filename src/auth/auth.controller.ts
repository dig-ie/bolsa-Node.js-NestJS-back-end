import { Controller, Post, Body, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./decorators/public.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";

/**
 * 🔓 Auth Controller
 *
 * Gerencia autenticação e informações do usuário.
 *
 * ROTAS PÚBLICAS:
 * - POST /auth/login - Qualquer pessoa pode fazer login
 *
 * ROTAS PROTEGIDAS:
 * - GET /auth/profile - Apenas usuários autenticados
 */
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 🌍 Rota pública de login
   * @Public() remove a necessidade de autenticação
   */
  @Public()
  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  /**
   * 🔐 Rota protegida - perfil do usuário
   * Apenas usuários autenticados podem acessar
   * Demonstra o uso do decorator @CurrentUser()
   */
  @Get("profile")
  async getProfile(@CurrentUser() user: any) {
    return {
      message: "Dados do usuário autenticado",
      user: {
        id: user.userId,
        email: user.email,
        role: user.role,
      },
    };
  }
}
