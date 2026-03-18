import { Injectable,BadRequestException,ConflictException,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository,DataSource } from "typeorm";
import { WalletBalance } from "./entities/wallet.entity";
import { Transaction } from "src/transaction/entities/transaction.entities";
import { FxService } from "src/fx/fx.services";
import { FundwalletDto } from "./dto/fund-wallet.dto";
import { ConverttDto } from "./dto/convert.dto";
import {Trans}
@Injectable()
export class WalletServices{

}