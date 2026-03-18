import { Entity,PrimaryGeneratedColumn,CreateDateColumn,ManyToOne,JoinColumn } from "typeorm";
import { User } from "src/users/users.entity";

@Entity('otps')

export class Otp{

    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @
}