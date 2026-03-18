import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn, Index,} from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { Currency } from 'src/commnon/enums/currency.enum';
import { TransactionType } from 'src/commnon/enums/transaction-type.enum';
import { TransactionStatus } from 'src/commnon/enums/transactions-status.enum';

@Entity('transactions')
@Index(['userId'])                         
@Index(['userId', 'createdAt'])            
@Index(['reference'])                      
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user!: User;

  @Column()
  userId!: string;

  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @Column({ type: 'enum', enum: Currency, nullable: true })
  fromCurrency!: Currency;

  @Column({ type: 'enum', enum: Currency, nullable: true })
  toCurrency!: Currency;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  fromAmount!: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  toAmount!: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  rate!: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status!: TransactionStatus;

  @Column({ nullable: true, unique: true })
  reference!: string;

  @Column({ nullable: true, type: 'text' })
  note!: string;

  @CreateDateColumn()
  createdAt!: Date;
}