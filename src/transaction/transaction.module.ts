import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entities";
import { TransactionsService } from "./transaction.service";
import { TransactionContrller } from "./transaction.controller";
import { getRepositoryToken } from "@nestjs/typeorm";

@Module({
    imports:[TypeOrmModule.forFeature([Transaction])],
    providers:[
        TransactionsService,
        {
            provide: 'TRANSACTION_REPOSITORY',
            useFactory: (repo) => repo,
            inject: [getRepositoryToken(Transaction)],
        }
    ],
    controllers:[TransactionContrller],
    exports: ['TRANSACTION_REPOSITORY', TransactionsService]
})

export class TransactionModule{}