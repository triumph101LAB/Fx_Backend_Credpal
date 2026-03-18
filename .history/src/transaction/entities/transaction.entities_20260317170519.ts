import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn, 
  CreateDateColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Currency } from '../../common/enums/currency.enum';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { TransactionStatus } from '../../common/enums/transaction-status.enum';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId!: string;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column({ type: 'enum', enum: Currency, nullable: true })
  fromCurrency: Currency;

  @Column({ type: 'enum', enum: Currency, nullable: true })
  toCurrency: Currency;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  fromAmount!: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  toAmount!: string;

  @Column({ type: 'decimal', precision: 20, scale: 8, nullable: true })
  rate!: string;

  @Column({ type: 'enum', enum: TransactionStatus, default: TransactionStatus.PENDING })
  status: TransactionStatus;

  @Column({ nullable: true, unique: true })
  reference!: string;

  @Column({ nullable: true, type: 'text' })
  note!: string;

  @CreateDateColumn()
  createdAt!: Date;
}