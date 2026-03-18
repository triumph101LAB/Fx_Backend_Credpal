import { Module } from "@nestjs/common";
import {Wal}
import { WalletController } from "./wallet.controller";
@Module({
    imports:[],
    providers:[WalletServices],
    controllers:[WalletController],
    exports:[]
})

export class WalletModule{}