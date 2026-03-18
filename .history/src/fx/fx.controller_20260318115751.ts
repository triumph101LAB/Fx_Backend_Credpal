import { Controller, Get, Query, UseGuards, Header } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FxService } from './fx.service';
import { JwtAuthGuard } from 'src/auth/stratetgy/jwt.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Throttle } from '@nestjs/throttler';

@ApiTags('FX')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fx')
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @Get('rates')
  @Header('Cache-Control', 'public, max-age=300') // 5 min cache
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // stricter limit on this endpoint
  getRates(@Query('base') base: string = 'NGN') {
    return this.fxService.getAllRates(base);
  }
}
