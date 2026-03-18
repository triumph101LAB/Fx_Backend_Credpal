import { IsEnum,IsNumber,IsPositive,IsOptional,IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "src/commnon/enums/currency.enum";

export class FundwalletDto{
    @ApiProperty({example:5000})
    @IsNumber()
    @IsPositive()
    amount!:number;

    @ApiProperty({enum:Currency, default:Currency.NGN})
    @IsEnum(Currency)
    currency!:Currency;

    @ApiProperty({required:false, description: 'Idempotency key'})
    @IsOptional
}