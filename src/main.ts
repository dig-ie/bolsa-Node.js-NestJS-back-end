import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  });

  // ** 🧩 Enables global validation for all DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // automatically removes properties not defined in the DTO class
      forbidNonWhitelisted: true, // throws an error if unknown properties are present in the request
      transform: true, // converts plain JavaScript objects into instances of their corresponding DTO classes
    })
  );
}
bootstrap();
