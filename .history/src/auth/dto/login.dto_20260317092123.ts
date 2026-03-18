import { IsEmail, IsNotEmpty, IsString, isNotEmpty } from "class-validator";
export class LoginDto{
    
    @IsEmail()
    @isNotEmpty('example')
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string



}