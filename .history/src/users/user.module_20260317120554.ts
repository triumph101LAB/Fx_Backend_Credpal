import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import {TypeOr}

@Module({
    imports:[Type],
    providers:[UsersService],
    exports:[UsersService]
})

export class UserModule{}