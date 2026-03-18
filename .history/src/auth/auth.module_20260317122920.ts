import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./stratetgy/jwt.strategy";
import { UserModule } from "src/users/user.module";
import { MailModule } from "src/mail/mail.module";
import { Otp } from "src/otp/entities/otp.entity";
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports:[
    TypeOrmModule.forFeature([Otp]),
    PassportModule,
    JwtModule.registerAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService) =>({
        secret: config.get<string>('JWT_')
      })
    })
  ],  
  controllers:[AuthController],  
  providers:[AuthService]
})
export class AuthModule {}