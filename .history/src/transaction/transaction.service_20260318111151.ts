import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly txRepo: Repository<Transaction>,
  ) {}

  async getHistory(userId: string, page = 1, limit = 20) {
    // Cap limit to prevent abuse — nobody should fetch 10,000 records
    const safeLimit = Math.min(limit, 100);

    const [data, total] = await this.txRepo
      .createQueryBuilder('tx')
      .select([
        'tx.id',
        'tx.type',
        'tx.fromCurrency',
        'tx.toCurrency',
        'CAST(tx.fromAmount AS FLOAT) AS fromAmount',
        'CAST(tx.toAmount AS FLOAT) AS toAmount',
        'CAST(tx.rate AS FLOAT) AS rate',
        'tx.status',
        'tx.reference',
        'tx.note',
        'tx.createdAt',
      ])
      .where('tx.userId = :userId', { userId })
      .orderBy('tx.createdAt', 'DESC')
      .skip((page - 1) * safeLimit)
      .take(safeLimit)
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit: safeLimit,
        pages: Math.ceil(total / safeLimit),
      },
    };
  }
}