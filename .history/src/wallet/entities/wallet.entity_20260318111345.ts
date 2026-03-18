import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn, Unique,Index,} from 'typeorm';
import { User } from 'src/users/entities/users.entity';
import { Currency } from 'src/commnon/enums/currency.enum';

@Entity('wallet_balances')
@Unique(['userId', 'currency'])
@Index(['userId'])                    // fast lookup by user
export class WalletBalance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId!: string;

  @Column({ type: 'enum', enum: Currency })
  currency: Currency;

  @Column({ type: 'decimal', precision: 20, scale: 8, default: '0' })
  balance!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}