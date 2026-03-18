import { Entity, PrimaryGeneratedColumn,Column, CreateDateColumn,UpdateDateColumn } from "typeorm";

export enum UserRole {
    USER = 'USER',
    ADMIN = 'AMDIN',
}

@Entity('users')

export class User {
    @PrimaryGeneratedColumn('uuid')
    id!:string

    @Column({unique:true})
    email!:string
    
    @Column({default:false})
    isVerified!:boolean;

    @Column({type:'enum', enum:'UserRole', default:UserRole.USER})
    role!:UserRole

    @CreateDateColumn()
    createdAt:Date;

    @UpdateDateColumn()
    UpdatedAt:Date

}