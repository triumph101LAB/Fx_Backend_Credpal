import { Module, forwardRef } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { WalletController } from "./wallet.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FxModule } from "src/fx/fx.module";
import { TransactionModule } from "src/transaction/transaction.module";
import { WalletBalance } from "./entities/wallet.entity";

@Module({
    imports:[
        TypeOrmModule.forFeature([WalletBalance]),
        FxModule,
        forwardRef(() => TransactionModule)
    ],
    providers:[WalletService],
    controllers:[WalletController],
    exports:[]
})

export class WalletModule{}