import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')

export class AuthController {
constructor (private readonly authService:AuthService){}

@Post('/register')
register(@Body() dto:RegisterDto){
return this.authService.register(dto)

}
@Post('verify')
@HttpCode(200)
verify(@Body() dto:VerifyOtpDto){
return this.authService.verifyOtp(dto)
}
@Post('resend-otp')
@HttpCode(200)
resendOtp(@Body() dto: ResendOtpDto) {
  return this.authService.resendOtp(dto);
}

@Post('login')
@HttpCode(200)

login(@Body() dto:LoginDto){

return this.authService.login(dto)
}

}