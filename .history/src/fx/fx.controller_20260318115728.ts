import { Controller, Get, Query, UseGuards, Header } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FxService } from './fx.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
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
```

---

## Complete Scalability Checklist
```
✅ Redis caching for FX rates (5 min TTL)
✅ Pessimistic locking (prevents race conditions)
✅ Atomic transactions (QueryRunner)
✅ Database indexes (userId, createdAt, reference)
✅ Connection pooling (max 20 connections)
✅ Rate limiting (100 req/min globally)
✅ Pagination with cap (max 100 per page)
✅ PostgreSQL arithmetic (no JS mapping)
✅ Idempotency keys (no duplicate transactions)
✅ Async email queue with BullMQ (non-blocking)
✅ Admin role guard (role-based access)
✅ Request logging interceptor (analytics)
✅ Cache headers on FX endpoint
✅ External API timeout + fallback (5s timeout, DB fallback)
✅ Retry logic on email (3 attempts, 5s backoff)