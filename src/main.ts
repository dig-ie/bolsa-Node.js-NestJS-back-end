import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


    
  const config = new DocumentBuilder()
    .setTitle('Orders API')
    .setDescription('API documentation for the Orders system')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 

  console.log('Swagger running at http://localhost:3000/api');

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

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
