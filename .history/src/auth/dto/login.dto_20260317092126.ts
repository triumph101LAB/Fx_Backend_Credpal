import { IsEmail, IsNotEmpty, IsString, isNotEmpty } from "class-validator";
export class LoginDto{
    
    @IsEmail()
    @isNotEmpty('example@gmail.com')
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string



}