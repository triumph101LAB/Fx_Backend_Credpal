import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WalletBalance } from './entities/wallet.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
import { FxService } from '../fx/fx.service';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { ConvertDto } from './dto/convert.dto';
import { TransactionType } from '../common/enums/transaction-type.enum';
import { TransactionStatus } from '../common/enums/transaction-status.enum';
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
    // Let PostgreSQL cast the decimal — no JS mapping needed
    return this.balanceRepo
      .createQueryBuilder('wb')
      .select('wb.currency', 'currency')
      .addSelect('CAST(wb.balance AS FLOAT)', 'balance')
      .where('wb.userId = :userId', { userId })
      .getRawMany();
  }

  async fundWallet(userId: string, dto: FundWalletDto) {
    const reference = dto.reference ?? uuidv4();

    const existing = await this.txRepo.findOne({ where: { reference, userId } });
    if (existing?.status === TransactionStatus.SUCCESS) {
      return { message: 'Already processed', transaction: existing };
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
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

      // Let PostgreSQL handle the arithmetic
      balance.balance = () =>
        `CAST(balance AS DECIMAL(20,8)) + ${dto.amount}` as any;
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

      // Fetch updated balance from DB instead of computing in JS
      const updated = await this.balanceRepo
        .createQueryBuilder('wb')
        .select('CAST(wb.balance AS FLOAT)', 'balance')
        .where('wb.userId = :userId AND wb.currency = :currency', {
          userId,
          currency: dto.currency,
        })
        .getRawOne();

      return {
        message: 'Wallet funded successfully',
        balance: updated.balance,
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

  async convert(
    userId: string,
    dto: ConvertDto,
    type: TransactionType = TransactionType.CONVERT,
  ) {
    if (dto.fromCurrency === dto.toCurrency) {
      throw new BadRequestException('Cannot convert to same currency');
    }

    const reference = dto.reference ?? uuidv4();

    const existing = await this.txRepo.findOne({ where: { reference, userId } });
    if (existing?.status === TransactionStatus.SUCCESS) {
      return { message: 'Already processed', transaction: existing };
    }

    const rate = await this.fxService.getRate(dto.fromCurrency, dto.toCurrency);
    const toAmount = parseFloat((dto.amount * rate).toFixed(8));

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const source = await queryRunner.manager.findOne(WalletBalance, {
        where: { userId, currency: dto.fromCurrency },
        lock: { mode: 'pessimistic_write' },
      });

      if (!source) throw new NotFoundException(`No ${dto.fromCurrency} balance found`);
      if (parseFloat(source.balance) < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      // PostgreSQL handles arithmetic
      await queryRunner.manager
        .createQueryBuilder()
        .update(WalletBalance)
        .set({ balance: () => `CAST(balance AS DECIMAL(20,8)) - ${dto.amount}` })
        .where('userId = :userId AND currency = :currency', {
          userId,
          currency: dto.fromCurrency,
        })
        .execute();

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
        await queryRunner.manager.save(target);
      }

      await queryRunner.manager
        .createQueryBuilder()
        .update(WalletBalance)
        .set({ balance: () => `CAST(balance AS DECIMAL(20,8)) + ${toAmount}` })
        .where('userId = :userId AND currency = :currency', {
          userId,
          currency: dto.toCurrency,
        })
        .execute();

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