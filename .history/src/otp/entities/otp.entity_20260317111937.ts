import { Entity,PrimaryGeneratedColumn,CreateDateColumn,ManyToOne,JoinColumn, Column } from "typeorm";
import { User } from "src/users/users.entity";

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

    @Column()
    expiresAt:

}