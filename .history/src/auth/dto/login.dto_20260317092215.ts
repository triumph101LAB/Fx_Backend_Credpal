import { IsEmail,IsString,Isno} from "class-validator";
export class LoginDto{
    
    @IsEmail()
    @isNotEmpty()
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string



}