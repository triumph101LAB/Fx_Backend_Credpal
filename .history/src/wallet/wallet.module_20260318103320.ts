import { Module } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FxModule } from "src/fx/fx.module";
import { WalletBalance } from "./entities/wallet.entity";
@Module({
    imports:[
        TypeOrmModule.forFeature()
    ],
    providers:[WalletService],
    controllers:[WalletController],
    exports:[]
})

export class WalletModule{}