import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 🧠 Extract the JWT from the Authorization header as a Bearer token
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => req?.cookies?.access_token,
      ]),

      // 🚫 Reject expired tokens automatically
      ignoreExpiration: false,

      // 🔐 The secret key used to verify token signatures
      secretOrKey: configService.get<string>("JWT_SECRET"),
    });
  }

  // ✅ Called automatically after the token is verified
  async validate(payload: any) {
    /**
     * The `payload` contains the decoded JWT data.
     * Whatever this method returns will be attached to `req.user`.
     *
     * Example payload structure:
     * {
     *   sub: 1,
     *   email: 'user@example.com',
     *   role: 'ADMIN',
     *   iat: 1697123456,
     *   exp: 1697127056
     * }
     */
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}
