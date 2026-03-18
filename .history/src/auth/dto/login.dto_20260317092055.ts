import { IsEmail, IsNotEmpty, IsString, isNotEmpty } from "class-validator";
export class LoginDto{
    
    @IsEmail()
   
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string



}