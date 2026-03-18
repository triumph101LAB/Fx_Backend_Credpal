import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Transaction } from "typeorm";

@Injectable()

export class TransactionService{
    constructor(@InjectRepository){}
}