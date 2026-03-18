import { Injectable,BadRequestException,ConflictException,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository,DataSource } from "typeorm";
import { WalletBalance } from "./entities/wallet.entity";
import { Transaction } from "src/transaction/entities/transaction.entities";

@Injectable()
export class WalletServices{

}