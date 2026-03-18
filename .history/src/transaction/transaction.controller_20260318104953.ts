import { Controller,Get,Query,UseGuards } from "@nestjs/common";
import { ApiBearerAuth,ApiTags,ApiQuery } from "@nestjs/swagger";
import { TransactionService } from "./transaction.service";
import { JwtAuthGuard } from "src/auth/stratetgy/jwt.guard";
import { CurrentUser } from "src/commnon/decorators/current-user.decorator";
import { User } from "src/users/users.entity";

export class TransactionContrller{

    constructor(private readonly transactionService:TransactionService){}
}