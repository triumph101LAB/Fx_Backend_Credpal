import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { FxModule } from './fx/fx.module';
import { WalletModule } from './wallet/wallet.module';
import {}
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
        password:configService.get('DB_PASSWORD'),
        database:configService.get('DB_NAME'),
        entities:[__dirname + '/**/*.entity{.ts,.js}'],
        synchronize:true,
        logging:configService.get('NODE_ENV') === 'development',

      })
    }),
    UserModule,AuthModule,MailModule, FxModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
