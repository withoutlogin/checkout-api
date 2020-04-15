import { Module, OnModuleInit } from '@nestjs/common';
import { ProductPricingService } from './product-prices/product-pricing.service';
import { PricingController } from './pricing.controller';
import { PriceListsService } from './pricelists/pricelists.service';
import Dinero from 'dinero.js';
import { CurrencyConversionService } from './currency-conversion/currency-conversion.service';
import { ProductsController } from './products/products.controller';
import { GetPriceForProductQueryHandler } from './queries/handlers';

const queryHandlers = [GetPriceForProductQueryHandler];
@Module({
  providers: [
    ProductPricingService,
    PriceListsService,
    CurrencyConversionService,
    ...queryHandlers,
  ],
  exports: [ProductPricingService],
  controllers: [PricingController, ProductsController],
})
export class PricingModule implements OnModuleInit {
  onModuleInit() {
    Dinero.globalExchangeRatesApi = {
      endpoint: 'https://api.exchangeratesapi.io/latest?base={{from}}',
      propertyPath: 'rates.{{to}}',
    };
  }
}
