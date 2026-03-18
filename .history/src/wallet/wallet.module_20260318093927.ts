import { Module } from "@nestjs/common";
import { WalletServices } from "./wallet.service";
import { WalletController } from "./wallet.controller";
@Module({
    imports:[],
    providers:[WalletServices],
    controllers:[],
    exports:[]
})

export class WalletModule{}