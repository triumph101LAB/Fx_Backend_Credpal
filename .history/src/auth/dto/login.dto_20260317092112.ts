import { IsEmail, IsNotEmpty, IsString, isNotEmpty } from "class-validator";
export class LoginDto{
    
    @IsEmail()
    @isNotEmpty(valuee)
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string



}