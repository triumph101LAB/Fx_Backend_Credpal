import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { WalletBalance } from './entities/wallet.entity';
import { Transaction } from 'src/transaction/entities/transaction.entities';
import { FxService } from 'src/fx/fx.services';
import { FundwalletDto } from './dto/fund-wallet.dto';
import { ConvertDto } from './dto/convert.dto';
import { TransactionType } from 'src/commnon/enums/transaction-type.enum';
import { TransactionStatus } from 'src/commnon/enums/transactions-status.enum';
import { Currency } from 'src/commnon/enums/currency.enum';
import { v4 as uuidv4 } from 'uuid';

import { User } from 'src/users/entities/users.entity';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(WalletBalance)
    private readonly balanceRepo: Repository<WalletBalance>,
    @Inject(forwardRef(() => 'TRANSACTION_REPOSITORY'))
    private readonly txRepo: Repository<Transaction>,
    private readonly fxService: FxService,
    private readonly dataSource: DataSource,
  ) {}

  async initializeWallet(userId: string) {
    // Keep this as userId for internal/system calls (like during verification)
    const existing = await this.balanceRepo.findOne({
      where: { userId, currency: Currency.NGN },
    });

    if (!existing) {
      await this.balanceRepo.save(
        this.balanceRepo.create({
          userId,
          currency: Currency.NGN,
          balance: '0',
        }),
      );
    }
  }

  async getBalances(user: User) {
    return this.balanceRepo
      .createQueryBuilder('wb')
      .select('wb.currency', 'currency')
      .addSelect('CAST(wb.balance AS FLOAT)', 'balance')
      .where('wb.userId = :userId', { userId: user.id })
      .getRawMany();
  }

  async fundWallet(user: User, dto: FundwalletDto) {
    const reference = dto.reference ?? uuidv4();

    const existing = await this.txRepo.findOne({ where: { reference, userId: user.id } });
    if (existing?.status === TransactionStatus.SUCCESS) {
      return { message: 'Already processed', transaction: existing };
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let balance = await queryRunner.manager.findOne(WalletBalance, {
        where: { userId: user.id, currency: dto.currency },
        lock: { mode: 'pessimistic_write' },
      });

      if (!balance) {
        balance = queryRunner.manager.create(WalletBalance, {
          userId: user.id,
          currency: dto.currency,
          balance: '0',
        });
        await queryRunner.manager.save(balance);
      }

      // Let PostgreSQL handle the arithmetic
      await queryRunner.manager
        .createQueryBuilder()
        .update(WalletBalance)
        .set({ balance: () => `CAST(balance AS DECIMAL(20,8)) + ${dto.amount}` })
        .where('userId = :userId AND currency = :currency', {
          userId: user.id,
          currency: dto.currency,
        })
        .execute();

      const tx = queryRunner.manager.create(Transaction, {
        userId: user.id,
        type: TransactionType.FUND,
        toCurrency: dto.currency,
        toAmount: dto.amount.toFixed(8),
        status: TransactionStatus.SUCCESS,
        reference,
        note: `Funded ${dto.amount} ${dto.currency}`,
      });
      await queryRunner.manager.save(tx);

      await queryRunner.commitTransaction();

      // Fetch updated balance from DB
      const updated = await this.balanceRepo
        .createQueryBuilder('wb')
        .select('CAST(wb.balance AS FLOAT)', 'balance')
        .where('wb.userId = :userId AND wb.currency = :currency', {
          userId: user.id,
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
    user: User,
    dto: ConvertDto,
    type: TransactionType = TransactionType.CONVERT,
  ) {
    if (dto.fromCurrency === dto.toCurrency) {
      throw new BadRequestException('Cannot convert to same currency');
    }

    if (dto.fromCurrency !== Currency.NGN && dto.toCurrency !== Currency.NGN) {
      throw new BadRequestException('One of the currencies must be Naira (NGN)');
    }

    const reference = dto.reference ?? uuidv4();

    const existing = await this.txRepo.findOne({ where: { reference, userId: user.id } });
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
        where: { userId: user.id, currency: dto.fromCurrency },
        lock: { mode: 'pessimistic_write' },
      });

      if (!source) throw new NotFoundException(`No ${dto.fromCurrency} balance found`);
      if (parseFloat(source.balance) < dto.amount) {
        throw new BadRequestException('Insufficient balance');
      }

      await queryRunner.manager
        .createQueryBuilder()
        .update(WalletBalance)
        .set({ balance: () => `CAST(balance AS DECIMAL(20,8)) - ${dto.amount}` })
        .where('userId = :userId AND currency = :currency', {
          userId: user.id,
          currency: dto.fromCurrency,
        })
        .execute();

      let target = await queryRunner.manager.findOne(WalletBalance, {
        where: { userId: user.id, currency: dto.toCurrency },
        lock: { mode: 'pessimistic_write' },
      });

      if (!target) {
        target = queryRunner.manager.create(WalletBalance, {
          userId: user.id,
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
          userId: user.id,
          currency: dto.toCurrency,
        })
        .execute();

      const tx = queryRunner.manager.create(Transaction, {
        userId: user.id,
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