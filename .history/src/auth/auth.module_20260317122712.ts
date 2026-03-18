import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./stratetgy/jwt.strategy";
import { UserModule } from "src/users/user.module";
import {}
@Module({
  imports:[],  
  controllers:[AuthController],  
  providers:[AuthService]
})
export class AuthModule {}