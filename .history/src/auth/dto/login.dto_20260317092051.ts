import { IsEmail, IsNotEmpty, IsString, isNotEmpty } from "class-validator";
export class LoginDto{
    @isNotEmpty()
    @IsEmail()
   
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string



}