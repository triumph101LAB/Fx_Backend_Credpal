import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FxService } from './fx.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('FX')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fx')
export class FxController {
  constructor(private readonly fxService: FxService) {}

  @Get('rates')
  getRates(@Query('base') base: string = 'NGN') {
    return this.fxService.getAllRates(base);
  }
}
```

---

**What's left before testing FX:**
```
❌ fx.module.ts              ← 2 minutes
❌ app.module.ts update      ← 2 minutes (add FxModule)
❌ FX API key in .env        ← 2 minutes
❌ Redis running             ← 1 minute
```

**That's it — 4 things.** FX is the simplest module to test since it's just one GET endpoint.

After those 4 things you can hit:
```
GET http://localhost:3000/fx/rates
Authorization: Bearer <your_jwt_token>