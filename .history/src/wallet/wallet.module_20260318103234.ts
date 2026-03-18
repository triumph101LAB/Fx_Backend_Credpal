import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
    imports:[],
    providers:[WalletService],
    controllers:[WalletController],
    exports:[]
})

export class WalletModule{}