import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entities";

@Injectable()

export class TransactionService{
    constructor(@InjectRepository (Transaction) private readonly txRepo: Repository <Transaction>){}

    async getHistory(user){}
}