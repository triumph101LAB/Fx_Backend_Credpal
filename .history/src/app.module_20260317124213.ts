import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
@Module({
  imports: [UserModule,AuthModule,MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
