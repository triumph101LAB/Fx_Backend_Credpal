import { Injectable,ConflictException,BadRequestException,UnauthorizedException } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { VerifyOtpDto } from "./dto/verify-otp.dto";
import {InjectRepository} from 'typeorm'
@Injectable()

export class AuthService{

register(){

}

login(){

}

VerifyOtp(){

}

}