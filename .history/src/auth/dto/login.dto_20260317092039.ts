import { IsEmail, IsNotEmpty, IsString, isNotEmpty } from "class-validator";
export class LoginDto{

    @IsEmail()
    @isNotEmpty()
    email!:string

    @IsString()
    @IsNotEmpty
    password!:string



}