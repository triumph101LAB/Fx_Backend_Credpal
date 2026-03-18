import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports:[TypeI],
    providers:[UsersService],
    exports:[UsersService]
})

export class UserModule{}