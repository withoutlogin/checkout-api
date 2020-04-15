import {
  Controller,
  Get,
  Param,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { ProductPrice } from './product-prices/product-price';
import { ProductPricingService } from './product-prices/product-pricing.service';
import { PriceListsService } from './pricelists/pricelists.service';
import { Currency } from './money';
import { CreatedLocationInterceptor } from '../common/rest/interceptors';

@Controller('pricing')
export class PricingController {
  constructor(
    private priceListsService: PriceListsService,
    private pricingService: ProductPricingService,
  ) {}

  @Get('/pricelists')
  async getPriceLists(): Promise<{ currency: Currency }[]> {
    const supportedCurrencies = await this.priceListsService.getSupportedCurrencies();
    return supportedCurrencies.map((currency) => ({ currency }));
  }

  @Get('/pricelists/:currency/products')
  async getPriceForAllProducts(
    @Param('currency') currency: string,
  ): Promise<ProductPrice[]> {
    const supportedCurrencies = await this.priceListsService.getSupportedCurrencies();
    if (supportedCurrencies.includes(currency as Currency)) {
      const prices = await this.pricingService.getPriceList(
        currency as Currency,
      );
      return Array.from(prices.values());
    }
    // throw new NotFoundException();
    return [];
  }

  @Get('pricelists/:currency/products/:productId')
  async getPriceForProduct(
    @Param('currency') currency: string,
    @Param('productId') productId: string,
  ): Promise<ProductPrice> {
    const supportedCurrencies = await this.priceListsService.getSupportedCurrencies();
    if (supportedCurrencies.includes(currency as Currency)) {
      const price = await this.pricingService.getPriceInCurrency(
        productId,
        currency as Currency,
      );
      if (price) {
        return price;
      }
    }
    throw new NotFoundException();
  }
}
