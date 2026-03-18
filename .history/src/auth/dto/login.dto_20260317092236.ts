import { IsEmail,IsString,IsNotEmpty} from "class-validator";
export class LoginDto{
    
    @IsEmail()
    @isNotEmpty()
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string



}