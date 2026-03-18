import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';,
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'; 
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
  .setVersion('1.0')
  .addBearerAuth()
  .build()

  SwaggerModule.setup('api/docs',app,SwaggerModule.createDocument(app,config))
  await app.listen(process.env.PORT ?? 3000);
  console.log('aPP IS RUNNING! ')
  console.log('Swagger Docs are ')
}
bootstrap();
