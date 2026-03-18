import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import {Type}

@Module({
    imports:[Type],
    providers:[UsersService],
    exports:[UsersService]
})

export class UserModule{}