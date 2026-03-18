import { Entity, PrimaryGeneratedColumn,Column, CreateDateColumn,UpdateDateColumn } from "typeorm";

export enum UserRole {
    USER = 'USER',
    ADMIN = 'AMDIN',
}

@Entity('users')