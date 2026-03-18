import { Controller,Get,Query,UseGuards } from "@nestjs/common";
import { ApiBearerAuth,ApiTags,ApiQuery } from "@nestjs/swagger";
import { TransactionService } from "./transaction.service";
import { JwtAuthGuard } from "src/auth/stratetgy/jwt.guard";