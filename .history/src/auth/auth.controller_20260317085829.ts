import { Controller,Post,Body,HttpCode } from "@nestjs/common";
import{ApiTags} from '@nestjs/swagger';
import { AuthService } from "./auth.service";
import { verify } from "crypto";


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
return this.authService.VerifyOtpDto(dto)
}

@Post('login')
@HttpCode(200)

login(@Body dto:LoginDto){

return this.authService
}

}