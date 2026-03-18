import { IsEmail, IsString, isNotEmpty } from "class-validator";
export class LoginDto{

    @IsEmail()
    @isNotEmpty()
    email!:string

    



}