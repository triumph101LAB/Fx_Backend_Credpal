import {Injectable,BadRequestException,ConflictException,NotFoundException,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WalletBalance } from './entities/wallet.entity';
import { Transaction } from 'src/transaction/entities/transaction.entities';
import { FxService } from 'src/fx/fx.services';
import { FundwalletDto } from './dto/fund-wallet.dto';
import { ConvertDto } from './dto/convert.dto';
import { TransactionType } from 'src/commnon/enums/transaction-type.enum';
import { TransactionStatus } from 'src/commnon/enums/transactions-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletBalance)
    private readonly balanceRepo: Repository<WalletBalance>,
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
    private readonly fxService: FxService,
    private readonly dataSource: DataSource,
  ) {}

  async getBalances(userId: string) {
    const balances = await this.balanceRepo.find({ where: { userId } });
    return balances.map((b) => ({
      currency: b.currency,
      balance: parseFloat(b.balance),
    }));
  }

  async fundWallet(userId: string, dto: FundwalletDto) {
    const reference = dto.reference ?? uuidv4();

    // Idempotency check
    const existing = await this.txRepo.findOne({ where: { reference, userId } });
    if (existing?.status === TransactionStatus.SUCCESS) {
      return { message: 'Already processed', transaction: existing };
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lock or create balance row
      let balance = await queryRunner.manager.findOne(WalletBalance, {
        where: { userId, currency: dto.currency },
        lock: { mode: 'pessimistic_write' },
      });

      if (!balance) {
        balance = queryRunner.manager.create(WalletBalance, {
          userId,
          currency: dto.currency,
          balance: '0',
        });
      }

      const newBalance = parseFloat(balance.balance) + dto.amount;
      balance.balance = newBalance.toFixed(8);
      await queryRunner.manager.save(balance);

      const tx = queryRunner.manager.create(Transaction, {
        userId,
        type: TransactionType.FUND,
        toCurrency: dto.currency,
        toAmount: dto.amount.toFixed(8),
        status: TransactionStatus.SUCCESS,
        reference,
        note: `Funded ${dto.amount} ${dto.currency}`,
      });
      await queryRunner.manager.save(tx);

      await queryRunner.commitTransaction();
      return {
        message: 'Wallet funded successfully',
        balance: newBalance,
        currency: dto.currency,
        reference,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async convert(userId: string,dto: ConvertDto,type: TransactionType = TransactionType.CONVERT,) {
    if (dto.fromCurrency === dto.toCurrency) {
      throw new BadRequestException('Cannot convert to same currency');
    }

    const reference = dto.reference ?? uuidv4();

    // Idempotency check
    const existing = await this.txRepo.findOne({ where: { reference, userId } });
    if (existing?.status === TransactionStatus.SUCCESS) {
      return { message: 'Already processed', transaction: existing };
    }

    // Get live FX rate
    const rate = await this.fxService.getRate(dto.fromCurrency, dto.toCurrency);
    const toAmount = parseFloat((dto.amount * rate).toFixed(8));

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Lock source balance
      const source = await queryRunner.manager.findOne(WalletBalance, {
        where: { userId, currency: dto.fromCurrency },
        lock: { mode: 'pessimistic_write' },
      });

      if (!source) {
        throw new NotFoundException(`No ${dto.fromCurrency} balance found`);
      }
      if (parseFloat(source.balance) < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // Deduct from source
      source.balance = (parseFloat(source.balance) - dto.amount).toFixed(8);
      await queryRunner.manager.save(source);

      // Lock or create target balance
      let target = await queryRunner.manager.findOne(WalletBalance, {
        where: { userId, currency: dto.toCurrency },
        lock: { mode: 'pessimistic_write' },
      });

      if (!target) {
        target = queryRunner.manager.create(WalletBalance, {
          userId,
          currency: dto.toCurrency,
          balance: '0',
        });
      }

      target.balance = (parseFloat(target.balance) + toAmount).toFixed(8);
      await queryRunner.manager.save(target);

      const tx = queryRunner.manager.create(Transaction, {
        userId,
        type,
        fromCurrency: dto.fromCurrency,
        toCurrency: dto.toCurrency,
        fromAmount: dto.amount.toFixed(8),
        toAmount: toAmount.toFixed(8),
        rate: rate.toFixed(8),
        status: TransactionStatus.SUCCESS,
        reference,
        note: `Converted ${dto.amount} ${dto.fromCurrency} → ${toAmount} ${dto.toCurrency} @ ${rate}`,
      });
      await queryRunner.manager.save(tx);

      await queryRunner.commitTransaction();

      return {
        message: 'Conversion successful',
        from: { currency: dto.fromCurrency, amount: dto.amount },
        to: { currency: dto.toCurrency, amount: toAmount },
        rate,
        reference,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}