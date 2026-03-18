import { Module } from "@nestjs/common";
import 
import { WalletController } from "./wallet.controller";
@Module({
    imports:[],
    providers:[WalletServices],
    controllers:[WalletController],
    exports:[]
})

export class WalletModule{}