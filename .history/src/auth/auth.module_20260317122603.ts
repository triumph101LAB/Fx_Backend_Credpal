import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import{TyPE}
@Module({
  imports:[],  
  controllers:[AuthController],  
  providers:[AuthService]
})
export class AuthModule {}