import { Module, OnModuleInit } from '@nestjs/common';
import { ProductPricingService } from './product-pricing.service';
import { PricingController } from './pricing.controller';
import { PriceListsService } from './pricelists/pricelists.service';
import Dinero from 'dinero.js';

@Module({
  providers: [ProductPricingService, PriceListsService],
  exports: [ProductPricingService],
  controllers: [PricingController],
})
export class PricingModule implements OnModuleInit {
  onModuleInit() {
    Dinero.globalExchangeRatesApi = {
      endpoint: 'https://api.exchangeratesapi.io/latest?base={{from}}',
      propertyPath: 'rates.{{to}}',
    };
  }
}
