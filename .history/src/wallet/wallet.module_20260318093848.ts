import { Module } from "@nestjs/common";
import { WalletServices } from "./wallet.service";
@Module({
    imports:[],
    providers:[WalletServices],
    exports:[]
})

export class WalletModule{}