import * as dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { LoggingInterceptor } from './commnon/interceptors/logging.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
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
  app.useGlobalInterceptors(new LoggingInterceptor())

  const config = new DocumentBuilder()
  .setTitle('FX Trading API')
  .setDescription('Multi-currency wallet and FX trading backend')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

  SwaggerModule.setup('api/docs',app,SwaggerModule.createDocument(app,config))
  await app.listen(process.env.PORT ?? 3000);
  console.log('APP IS RUNNING! ')
  console.log('Swagger Docs are http://localhost:3000/api/docs')
}
bootstrap();
