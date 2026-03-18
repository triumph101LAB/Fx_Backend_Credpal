import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./users.entity";

@Module({
    providers:[UsersService],
    exports:[UsersService]
})