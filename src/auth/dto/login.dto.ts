import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail(undefined, { message: "Forneça um email válido" })
  email: string;

  @IsString()
  @MinLength(6, { message: "Senha deve ter no mínimo 6 caracteres" })
  password: string;
}
