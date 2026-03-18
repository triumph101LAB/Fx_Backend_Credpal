import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
@Module({
    imports:[],
    providers:[WalletServices],
    controllers:[WalletController],
    exports:[]
})

export class WalletModule{}