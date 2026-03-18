import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from 'src/auth/stratetgy/jwt.guard';
import { CurrentUser } from 'src/commnon/decorators/current-user.decorator';
import { User } from 'src/users/users.entity';
import { FundwalletDto } from './dto/fund-wallet.dto';
import { ConvertDto } from './dto/convert.dto';
import { TransactionType } from 'src/commnon/enums/transaction-type.enum';

@ApiTags('Wallet')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  getBalances(@CurrentUser() user: User) {
    return this.walletService.getBalances(user.id);
  }

  @Post('fund')
  fund(@CurrentUser() user: User, @Body() dto: FundwalletDto) {
    return this.walletService.fundWallet(user.id, dto);
  }

  @Post('convert')
  convert(@CurrentUser() user: User, @Body() dto: ConvertDto) {
    return this.walletService.convert(user.id, dto, TransactionType.CONVERT);
  }

  @Post('trade')
  trade(@CurrentUser() user: User, @Body() dto: ConvertDto) {
    return this.walletService.convert(user.id, dto, TransactionType.TRADE);
  }
}