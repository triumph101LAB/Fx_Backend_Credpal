import { IsEmail, IsString, lEN } from "class-validator";
// verify-otp.dto.ts
export class VerifyOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(6, 6)
  otp!: string;
}