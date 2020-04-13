import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { PricingModule } from './pricing/pricing.module';

@Module({
  imports: [CartModule, PricingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
