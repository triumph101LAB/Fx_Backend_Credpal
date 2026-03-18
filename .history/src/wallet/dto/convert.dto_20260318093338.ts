import { IsEnum,IsNumber,IsPositive,IsOptional,IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Currency } from "src/commnon/enums/currency.enum";

export class FundwalletDto{
    @ApiProperty
}