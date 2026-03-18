import { Injectable,BadRequestException,ConflictException,NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository,DataSource } from "typeorm";
import { WalletBalance } from "./entities/wallet.entity";
@Injectable()
export class WalletServices{

}