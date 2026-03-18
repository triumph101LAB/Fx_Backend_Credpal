import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn 
} from 'typeorm';

@Entity('fx_rates')
export class FxRate {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  baseCurrency: string;

  @Column()
  quoteCurrency: string;

  @Column({ type: 'decimal', precision: 20, scale: 8 })
  rate: string;

  @CreateDateColumn()
  fetchedAt: Date;
}
