import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FxRate } from './entities/fx-rates.entity';
import { FxService } from './fx.service';
import { FxController } from './fx.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FxRate])],
  providers: [FxService],
  controllers: [FxController],
  exports: [FxService],
})
export class FxModule {}