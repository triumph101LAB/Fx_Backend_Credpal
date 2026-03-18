import { Module } from '@nestjs/common';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { FxModule } from './fx/fx.module';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule,ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}),
    ThrottlerModule.forRoot([{
      ttl:60000,
      limit:100,
    }]),
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

        extra:{
          max:20,
          idleTimeoutMillis:3000,
          connectionTimeoutMillis:2000
        }

      })
    }),
    UserModule,AuthModule,MailModule, FxModule,TransactionModule,WalletModule],

  providers: [
    {
      provide:APP_GUARD,
      useClass:ThrottlerGuard,
    }
  ],
})
export class AppModule {}
