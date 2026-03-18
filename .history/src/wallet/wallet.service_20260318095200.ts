import { Injectable,BadRequestException,ConflictException,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository,DataSource } from "typeorm";
import { WalletBalance } from "./entities/wallet.entity";
import { Transaction } from "src/transaction/entities/transaction.entities";
import {Fx}
@Injectable()
export class WalletServices{

}