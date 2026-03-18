import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import 
@Module({
  imports: [UserModule,AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
