import { Injectable,UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import {ExtractJwt, Strategey} from 'passport-jwt'
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategey){

    constructor(
        private configService:ConfigService,
        private usersService:UsersService,

    ){
        
    }
}
