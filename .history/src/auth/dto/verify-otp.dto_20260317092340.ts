import { IsEmail, IsString, Length } from "class-validator";
// verify-otp.dto.ts
export class VerifyOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6)
  otp!: string;
}