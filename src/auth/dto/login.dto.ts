import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail(undefined, { message: "Forneça um email válido" })
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}
