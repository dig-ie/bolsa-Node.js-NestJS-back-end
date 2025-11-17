import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/common/prisma.service";
// pnpm test:e2e -- auth-guards
/**
 * 🧪 Testes E2E para Guards de Autenticação
 *
 * Este arquivo testa o sistema completo de guards:
 * - JwtAuthGuard (autenticação)
 * - RolesGuard (autorização)
 * - Decorators @Public() e @Roles()
 *
 * CENÁRIOS TESTADOS:
 * 1. Rotas públicas (@Public) - devem funcionar sem token
 * 2. Rotas protegidas sem token - devem retornar 401
 * 3. Rotas protegidas com token válido - devem funcionar
 * 4. Rotas com @Roles - devem verificar permissões
 * 5. Decorator @CurrentUser - deve injetar dados do usuário
 */
describe("Guards de Autenticação (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let userToken: string;
  let adminId: string;
  let userId: string;

  /**
   * 🏗️ Configuração inicial dos testes
   * Cria usuários de teste e gera tokens
   */
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // 🧹 Limpa banco de dados antes dos testes
    await prisma.user.deleteMany();

    // 👤 Cria usuário ADMIN de teste
    const adminResponse = await request(app.getHttpServer())
      .post("/users")
      .send({
        email: "admin@test.com",
        password: "Admin123!",
        name: "Admin Test",
      })
      .expect(201);

    adminId = adminResponse.body.id;

    // Atualiza role para ADMIN manualmente (não há endpoint público para isso)
    await prisma.user.update({
      where: { id: adminId },
      data: { role: "ADMIN" },
    });

    // 👤 Cria usuário USER de teste
    const userResponse = await request(app.getHttpServer())
      .post("/users")
      .send({
        email: "user@test.com",
        password: "User123!",
        name: "User Test",
      })
      .expect(201);

    userId = userResponse.body.id;

    // 🔑 Faz login para obter tokens
    const adminLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "admin@test.com",
        password: "Admin123!",
      })
      .expect(201);

    adminToken = adminLogin.body.access_token;

    const userLogin = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "user@test.com",
        password: "User123!",
      })
      .expect(201);

    userToken = userLogin.body.access_token;
  });

  /**
   * 🧹 Limpeza após todos os testes
   */
  afterAll(async () => {
    await prisma.user.deleteMany();
    await app.close();
  });

  /**
   * ================================
   * 🌍 TESTES DE ROTAS PÚBLICAS
   * ================================
   */
  describe("Rotas Públicas (@Public)", () => {
    it("POST /users - deve permitir registro sem autenticação", () => {
      return request(app.getHttpServer())
        .post("/users")
        .send({
          email: "newuser@test.com",
          password: "NewUser123!",
          name: "New User",
        })
        .expect(201);
    });

    it("POST /auth/login - deve permitir login sem autenticação", () => {
      return request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "admin@test.com",
          password: "Admin123!",
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty("access_token");
          expect(res.body).toHaveProperty("user");
        });
    });
  });

  /**
   * ================================
   * 🔐 TESTES DE AUTENTICAÇÃO
   * ================================
   */
  describe("Autenticação (JwtAuthGuard)", () => {
    it("GET /auth/profile - deve retornar 401 sem token", () => {
      return request(app.getHttpServer()).get("/auth/profile").expect(401);
    });

    it("GET /auth/profile - deve retornar perfil com token válido", () => {
      return request(app.getHttpServer())
        .get("/auth/profile")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.user.email).toBe("user@test.com");
          expect(res.body.user.role).toBe("user");
        });
    });
  });

  /**
   * ================================
   * 👮 TESTES DE AUTORIZAÇÃO POR ROLES
   * ================================
   */
  describe("Autorização por Roles (RolesGuard)", () => {
    describe("Rotas de ADMIN apenas", () => {
      it("GET /users - USER não deve ter acesso", () => {
        return request(app.getHttpServer())
          .get("/users")
          .set("Authorization", `Bearer ${userToken}`)
          .expect(403);
      });

      it("GET /users - ADMIN deve ter acesso", () => {
        return request(app.getHttpServer())
          .get("/users")
          .set("Authorization", `Bearer ${adminToken}`)
          .expect(200);
      });

      it("DELETE /users/:id - USER não deve poder deletar", () => {
        return request(app.getHttpServer())
          .delete(`/users/${userId}`)
          .set("Authorization", `Bearer ${userToken}`)
          .expect(403);
      });

      it("DELETE /users/:id - ADMIN deve poder deletar", async () => {
        // Cria usuário temporário para deletar
        const tempUser = await request(app.getHttpServer())
          .post("/users")
          .send({
            email: "temp@test.com",
            password: "Temp123!",
            name: "Temp User",
          });

        return request(app.getHttpServer())
          .delete(`/users/${tempUser.body.id}`)
          .set("Authorization", `Bearer ${adminToken}`)
          .expect(200);
      });
    });

    describe("Rotas acessíveis a qualquer role autenticada", () => {
      it("GET /users/me - USER deve ter acesso ao próprio perfil", () => {
        return request(app.getHttpServer())
          .get("/users/me")
          .set("Authorization", `Bearer ${userToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.email).toBe("user@test.com");
          });
      });

      it("GET /users/me - ADMIN também deve ter acesso", () => {
        return request(app.getHttpServer())
          .get("/users/me")
          .set("Authorization", `Bearer ${adminToken}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.email).toBe("admin@test.com");
          });
      });
    });
  });

  /**
   * ================================
   * 👤 TESTES DO DECORATOR @CurrentUser
   * ================================
   */
  describe("Decorator @CurrentUser", () => {
    it("deve extrair corretamente os dados do usuário", () => {
      return request(app.getHttpServer())
        .get("/auth/profile")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.user).toHaveProperty("id");
          expect(res.body.user).toHaveProperty("email");
          expect(res.body.user).toHaveProperty("role");
          expect(res.body.user.email).toBe("admin@test.com");
          expect(res.body.user.role).toBe("ADMIN");
        });
    });
  });

  /**
   * ================================
   * 🔄 TESTES DE FLUXO COMPLETO
   * ================================
   */
  describe("Fluxos Completos", () => {
    it("Fluxo: Registro → Login → Acesso à rota protegida", async () => {
      // 1. Registro
      const registerResponse = await request(app.getHttpServer())
        .post("/users")
        .send({
          email: "flow@test.com",
          password: "Flow123!",
          name: "Flow User",
        })
        .expect(201);

      expect(registerResponse.body).toHaveProperty("id");

      // 2. Login
      const loginResponse = await request(app.getHttpServer())
        .post("/auth/login")
        .send({
          email: "flow@test.com",
          password: "Flow123!",
        })
        .expect(201);

      const token = loginResponse.body.access_token;
      expect(token).toBeDefined();

      // 3. Acesso à rota protegida
      await request(app.getHttpServer())
        .get("/auth/profile")
        .set("Authorization", `Bearer ${token}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.user.email).toBe("flow@test.com");
        });
    });

    it("Fluxo: USER tenta acessar rota ADMIN → 403", async () => {
      // Tenta deletar outro usuário (apenas ADMIN)
      await request(app.getHttpServer())
        .delete(`/users/${adminId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);
    });

    it("Fluxo: ADMIN acessa todas as rotas com sucesso", async () => {
      // Ver todos os usuários
      await request(app.getHttpServer())
        .get("/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      // Ver próprio perfil
      await request(app.getHttpServer())
        .get("/users/me")
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);
    });
  });
});
