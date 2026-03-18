import { Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Unique
 } from "typeorm";
import { User } from "src/users/users.entity";
import{Currency} from "src/common/enumns/currency.enum"

@Entity('wallet_balances')
@Unique(['userId','Currency'])

export class WalletBalance {
    @PrimaryGeneratedColumn('')
}