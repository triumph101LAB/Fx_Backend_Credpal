import { IsEmail,IsString} from "class-validator";
export class LoginDto{
    
    @IsEmail()
    @isNotEmpty()
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string



}