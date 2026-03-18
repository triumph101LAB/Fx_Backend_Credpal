import {Injectable,ConflictException,BadRequestException,UnauthorizedException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { Otp } from '../otp/entities/otp.entity';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';
@Injectable()

export class AuthService{

    constructor(
        private usersService:UsersService,
        private jwtService:JwtService,
        private mailService:MailService,
        @InjectRepository(Otp)
        private readonly otpRepo: Repository<Otp>
    ){}

async register(dto:){
const existing = await this.usersService.findByEmail(dot.email)

if (existing) throw new ConflictException('Email already registered')

const passwordHash = await bcrypt.hash(dot.padd)    
}

login(){

}

VerifyOtp(){

}

}