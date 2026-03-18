import { IsEmail, IsNotEmpty, IsString, isNotEmpty } from "class-validator";
export class LoginDto{
    
    @IsEmail()
    @isNotEmpty(value:)
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string



}