import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FxModule } from "src/fx/fx.module";
import { WalletBalance } from "./entities/wallet.entity";
import { Transaction } from "typeorm";
@Module({
    imports:[
        TypeOrmModule.forFeature([WalletBalance,Transactione])
        ,FxModul
    ],
    providers:[WalletService],
    controllers:[WalletController],
    exports:[]
})

export class WalletModule{}