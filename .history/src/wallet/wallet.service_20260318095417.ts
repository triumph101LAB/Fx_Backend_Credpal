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
import { V4MAPPED } from "node:dns";
@Injectable()
export class WalletServices{


}