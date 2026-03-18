import { IsEmail, IsNotEmpty, IsString} from "class-validator";
export class LoginDto{
    
    @IsEmail()
    @isNotEmpty()
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string



}