import { Injectable } from '@nestjs/common';
import { PriceListMap } from '../product-prices/product-pricing.service';
import { ProductPrice } from 'pricing/product-prices/product-price';
import { Currency } from 'pricing/money';
import { ExchangeRatesApiOptions } from 'dinero.js';

@Injectable()
export class CurrencyConversionService {
  async convertPriceList(
    pricelist: PriceListMap,
    toCurrency: Currency,
  ): Promise<PriceListMap> {
    const converted: PriceListMap = new Map();

    const promises: Promise<ProductPrice>[] = Array.from(pricelist.keys()).map(
      async (productId: string): Promise<ProductPrice> => {
        const price = pricelist.get(productId) as ProductPrice;

        if (price.price.getCurrency() === toCurrency) {
          return price;
        }

        const newPrice = await price.price.convert(
          toCurrency,
          this.getConversionRatesFor(price.price.getCurrency()),
        );
        return new ProductPrice(price.productId, newPrice);
      },
    );
    const newPrices = await Promise.all(promises);
    newPrices.forEach((productPrice) => {
      converted.set(productPrice.productId, productPrice);
    });
    return converted;
  }
  getConversionRatesFor(currency: string): ExchangeRatesApiOptions {
    // a place where real api request may be cached as Promise.resolve(knownValue)
    return {
      endpoint: 'https://api.exchangeratesapi.io/latest?base={{from}}',
      propertyPath: 'rates.{{to}}',
    };
  }
}
