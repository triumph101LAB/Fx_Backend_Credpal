import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transaction } from "./entities/transaction.entities";

@Injectable()

export class TransactionService{
    constructor(@InjectRepository (Transaction) private readonly txRepo: Repository <Transaction>){}

    async getHistory(userId:string, page = 1, limit = 20){
        const [data, total] = await this.txRepo.findAndCount({
            where:{userId}
        })
    }
}