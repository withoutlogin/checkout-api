import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { PricingModule } from './pricing/pricing.module';
import { CommonRestModule } from 'common/rest/common-rest.module';
import { InitAppStateService } from 'cart/fixtures/init-app-state.service';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, CommonRestModule, CartModule, PricingModule],
  controllers: [AppController],
  providers: [AppService, InitAppStateService],
})
export class AppModule {}
