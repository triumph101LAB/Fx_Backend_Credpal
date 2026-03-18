import { Injectable,BadRequestException,ConflictException,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository,DataSource } from "typeorm";
import { WalletBalance } from "./entities/wallet.entity";
import { Transaction } from "src/transaction/entities/transaction.entities";
import { FxService } from "src/fx/fx.services";
import { FundwalletDto } from "./dto/fund-wallet.dto";
import { ConverttDto } from "./dto/convert.dto";
import { TransactionType } from "src/commnon/enums/transaction-type.enum";
import { TransactionStatus } from "src/commnon/enums/transactions-status.enum";
import { v4 as uuidv4 } from "uuid";
@Injectable()
export class WalletServices{

    constructor(
        @InjectRepository(WalletBalance) private readonly balanceRepo: Repository<WalletBalance>,
        @InjectRepository(Transaction) private readonly txRepo: Repository<Transaction>,
        private readonly fxService:FxService,
        private readonly dataSource:DataSource
    ){}

    async getBalance(userId:string){
        const balance = await this.balanceRepo.find({where:{userId}});
        return balance.map((b) => ({
            currency: b.currency,
            balance:parseFloat(b.balance)
        }))
    }

    async fundWallet(userId:string, dto:FundwalletDto){
        const existing = await this.txRepo.find
    }


}