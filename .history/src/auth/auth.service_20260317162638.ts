import {Injectable,ConflictException,BadRequestException,UnauthorizedException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.services';
import { Otp } from 'src/otp/entities/otp.entity';
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

async register(dto:RegisterDto){
const existing = await this.usersService.findByEmail(dto.email)

if (existing) throw new ConflictException('Email already registered')

const passwordHash = await bcrypt.hash(dto.password,12) 
const user = await this.usersService.create(dto.email, passwordHash)
const code = Math.floor(100000 + Math.random() * 900000).toString()
const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

await this.otpRepo.save(
    this.otpRepo.create({userId:user.id, code, expiresAt})
)

await this.mailService.sendOtp(user.email, code)

return {messge: "Registration was successfule, Check your email for an Otp"}
}

async login(dto:LoginDto){
    const user = await this.usersService.findByEmail(dto.email)

    if(!user) throw new UnauthorizedException('User Not found')
    if(!user.isVerified) throw new UnauthorizedException('Please verify your email first')    
    
    const valid = await bcrypt.compare(dto.password, user.passwordHash)
    if(!valid) throw new UnauthorizedException('Invalid Credentials')
    
    const token = this.jwtService.sign({sub: user.id, email:user.email})     
    return {message:"Login Successfull!", access_token:token}    
}

async verifyOtp(dto:VerifyOtpDto){
    const user = await this.usersService.findByEmail(dto.email)
    if(!user)throw new BadRequestException('User not Found')

    const otp = await this.otpRepo.findOne({
        where:{userId:user.id, code: dto.otp, isUsed:false},
        order: {createdAt:'DESC'}
    })
    
    if(!otp) throw new BadRequestException('Invalid OTP')
    if(otp.expiresAt< new Date()) throw new BadRequestException('OTP has Expired') 
     
    await this.otpRepo.update(otp.id, {isUsed:true})
    await this.usersService.markVerified(user.id);
    
    const token = this.jwtService.sign({sub:user.id, email:user.email})
    return{message:'Email has been Verified', access_token:token}
}

async resendOtp(dto: ResendOtpDto) {
  const user = await this.usersService.findByEmail(dto.email);
  if (!user) throw new BadRequestException('User not found');
  if (user.isVerified) throw new BadRequestException('Email already verified');

  // Invalidate all previous unused OTPs for this user
  await this.otpRepo.update(
    { userId: user.id, isUsed: false },
    { isUsed: true },
  );


  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await this.otpRepo.save(
    this.otpRepo.create({ userId: user.id, code, expiresAt }),
  );

  await this.mailService.sendOtp(user.email, code);

  return { message: 'New OTP sent. Check your email.' };
}
}