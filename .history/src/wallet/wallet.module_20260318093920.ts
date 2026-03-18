import { Module } from "@nestjs/common";
import { WalletServices } from "./wallet.service";
@Module({
    imports:[],
    providers:[WalletServices],
    controllers:[],
    exports:[]
})

export class WalletModule{}