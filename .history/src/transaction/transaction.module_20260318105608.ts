import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Transaction } from "./entities/transaction.entities";
import { TransactionService } from "./transaction.service";
import { TransactionContrller } from "./transaction.controller";

@Module({
    imports:[],
    providers:[TransactionService],
    controllers:[TransactionContrller]
})

export class TransactionModule{}