import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
import {TypeOrm}
@Module({
    imports:[],
    providers:[WalletService],
    controllers:[WalletController],
    exports:[]
})

export class WalletModule{}