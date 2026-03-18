import{isNotEmpty,IsEmail, IsString, IsNotEmpty} from 'class-validator'

export class RegisterDto{

    @IsEmail()
    @IsNotEmpty()
    email:string;


}