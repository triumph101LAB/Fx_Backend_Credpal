import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';,
import { DocumentBuilder } from '@nestjs/swagger'; 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist:true,
      forbidNonWhitelisted:true,
      transform:true
    })
  );

  const config = new DocumentBuilder()
  .setTitle('FX Trading API')
  .setDescription('Multi-currency wallet and FX trading backend')
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
