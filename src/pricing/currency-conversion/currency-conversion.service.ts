import { Injectable } from '@nestjs/common';
import { PriceListMap } from '../product-prices/product-pricing.service';
import { ProductPrice } from 'pricing/product-prices/product-price';
import { Currency } from 'pricing/money';
import { CurrencyConversionRatesService } from './currency-conversion-rates.service';

@Injectable()
export class CurrencyConversionService {
  constructor(private conversionRatesService: CurrencyConversionRatesService) {}

  async convertPriceList(
    priceList: PriceListMap,
    toCurrency: Currency,
  ): Promise<PriceListMap> {
    const converted: PriceListMap = new Map();

    const promises: Promise<ProductPrice>[] = Array.from(priceList.keys()).map(
      async (productId: string): Promise<ProductPrice> => {
        const price = priceList.get(productId) as ProductPrice;

        if (price.price.getCurrency() === toCurrency) {
          return price;
        }
        console.log('from', price.price.getCurrency(), 'to', toCurrency);
        const newPrice = await price.price.convert(toCurrency, {
          endpoint: this.conversionRatesService.getConversionRatesFor(
            price.price.getCurrency() as Currency,
          ),
          propertyPath: 'rates.{{to}}',
        });
        return new ProductPrice(price.productId, newPrice);
      },
    );
    const newPrices = await Promise.all(promises);
    newPrices.forEach((productPrice) => {
      converted.set(productPrice.productId, productPrice);
    });
    return converted;
  }
}
