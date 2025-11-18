import { Controller, Post, Body, Get, Res } from "@nestjs/common";
import { type Response } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Public } from "./decorators/public.decorator";
import { CurrentUser } from "./decorators/current-user.decorator";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token, user } = await this.authService.login(
      dto.email,
      dto.password
    );

    // 🧩 Define o cookie httpOnly
    res.cookie("token_httpOnly", token, {
      httpOnly: true,
      secure: false, // true somente em produção HTTPS
      sameSite: "lax",
      path: "/",
    });

    return { user };
  }

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
