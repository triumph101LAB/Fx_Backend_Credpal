import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import Redis from 'ioredis';
import { FxRate } from './entities/fx-rate.entity';

@Injectable()
export class FxService {
  private readonly logger = new Logger(FxService.name);
  private redis: Redis;
  private readonly ttl: number;

  constructor(
    @InjectRepository(FxRate)
    private readonly fxRateRepo: Repository<FxRate>,
    private readonly configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: configService.get('REDIS_HOST'),
      port: +configService.get('REDIS_PORT'),
    });
    this.ttl = +configService.get('FX_CACHE_TTL') || 300;
  }

  async getRate(base: string, quote: string): Promise<number> {
    const cacheKey = `fx:${base}:${quote}`;

    // 1. Check Redis cache first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for ${base}/${quote}`);
      return parseFloat(cached);
    }

    // 2. Fetch from external API
    try {
      const apiKey = this.configService.get('FX_API_KEY');
      const url = `${this.configService.get('FX_API_URL')}/${apiKey}/latest/${base}`;
      const { data } = await axios.get(url, { timeout: 5000 });

      if (data.result !== 'success') throw new Error('API returned failure');

      const rate = data.conversion_rates[quote];
      if (!rate) throw new Error(`Rate not found for ${base}/${quote}`);

      // Store in Redis with TTL
      await this.redis.setex(cacheKey, this.ttl, rate.toString());

      // Persist to DB as fallback
      await this.fxRateRepo.save(
        this.fxRateRepo.create({ 
          baseCurrency: base, 
          quoteCurrency: quote, 
          rate: rate.toString() 
        }),
      );

      return rate;
    } catch (error) {
      this.logger.warn(`FX API failed for ${base}/${quote}, trying DB fallback`);


      const fallback = await this.fxRateRepo.findOne({
        where: { baseCurrency: base, quoteCurrency: quote },
        order: { fetchedAt: 'DESC' },
      });

      if (fallback) {
        this.logger.warn(`Using stale rate for ${base}/${quote}: ${fallback.rate}`);
        return parseFloat(fallback.rate);
      }

      throw new ServiceUnavailableException(
        `FX rate unavailable for ${base}/${quote}`
      );
    }
  }

  async getAllRates(base: string = 'NGN'): Promise<Record<string, number>> {
    const cacheKey = `fx:all:${base}`;

    // Check Redis first
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache hit for all rates base ${base}`);
      return JSON.parse(cached);
    }

    try {
      const apiKey = this.configService.get('FX_API_KEY');
      const url = `${this.configService.get('FX_API_URL')}/${apiKey}/latest/${base}`;
      const { data } = await axios.get(url, { timeout: 5000 });

      if (data.result !== 'success') throw new Error('API returned failure');

      // Cache the full rates object
      await this.redis.setex(cacheKey, this.ttl, JSON.stringify(data.conversion_rates));

      return data.conversion_rates;
    } catch (error) {
      this.logger.error('Failed to fetch all rates', error);
      throw new ServiceUnavailableException('FX rates temporarily unavailable');
    }
  }
}
