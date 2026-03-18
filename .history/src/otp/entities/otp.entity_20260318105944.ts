import { Entity,PrimaryGeneratedColumn,CreateDateColumn,ManyToOne,JoinColumn, Column } from "typeorm";
import { User } from "src/users/entities/users.entity";

@Entity('otps')

export class Otp{

    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @ManyToOne(() =>User)
    @JoinColumn({name:'userId'})
    user!:User;

    @Column()
    userId!:string

    @Column()
    code!:string;

    @Column({default:false})
    isUsed!:boolean;

    @Column()
    expiresAt!:Date;

    @CreateDateColumn()
    createdAt!:Date

}