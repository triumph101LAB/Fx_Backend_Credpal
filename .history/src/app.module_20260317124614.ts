import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService) =>({
        type:'postgres',
        host:configService.get('DB_HOST'),
        port:configService.get<number>('DB_PORT'),
        username:configService.get('DB_USERNAME'),
        pas

      })
    })
    UserModule,AuthModule,MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
