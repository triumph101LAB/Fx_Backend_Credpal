import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entities";
import { TransactionsService } from "./transaction.service";
import { TransactionContrller } from "./transaction.controller";

@Module({
    imports:[TypeOrmModule.forFeature([Transaction])],
    providers:[TransactionService],
    controllers:[TransactionContrller]
})

export class TransactionModule{}