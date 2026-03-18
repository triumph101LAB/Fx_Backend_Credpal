import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn 
} from 'typeorm';

@Entity('fx_rates')
export class FxRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  baseCurrency: string;

  @Column()
  quoteCurrency: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  rate: string;

  @CreateDateColumn()
  fetchedAt: Date;
}
```

---

This is the simplest entity. Breaking it down:

**`baseCurrency / quoteCurrency`** — for a rate like `NGN/USD`, `baseCurrency` is `NGN` and `quoteCurrency` is `USD`. The rate tells you how much of `quoteCurrency` you get for 1 unit of `baseCurrency`.

**`rate`** — stored as string for the same decimal precision reason as wallet balance.

**`fetchedAt`** — uses `@CreateDateColumn()` which automatically records when this rate was fetched from the external API. This is what we use to find the most recent rate when Redis is down and we fall back to the database.

**No `@Unique()` constraint** — unlike wallet balances we don't enforce uniqueness here because we want to keep a history of rates over time. Every time we fetch from the API we insert a new row. The most recent one wins.

---

All three entities are done. Now go to pgAdmin and refresh your tables — you should now see:
```
✅ users
✅ otps
✅ wallet_balances
✅ transactions
✅ fx_rates