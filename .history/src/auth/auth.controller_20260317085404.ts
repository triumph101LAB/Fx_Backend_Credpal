import { Controller,Post,Body,HttpCode } from "@nestjs/common";
import{ApiTags} from '@nestjs/swagger';
import { AuthService } from "./auth.service";
import {RegisterDto} from 
@ApiTags('Auth')
@Controller('auth')

export class AuthController {
constructor (private readonly authService:AuthService){}
@Post('/login')



}