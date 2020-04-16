import { Injectable } from '@nestjs/common';
import { Maybe } from 'common/ts-helpers';
import { CurrencyConversionService } from 'pricing/currency-conversion/currency-conversion.service';
import { Currency } from 'pricing/money';
import { getInitialProductPricingAsPriceListMap } from '../fixtures/initial-product-pricing-and-texts';
import { ProductPrice } from './product-price';

export type PriceListMap = Map<string, ProductPrice>;
@Injectable()
export class ProductPricingService {
  pricelists: Map<string, PriceListMap>;
  basePriceList: PriceListMap;

  constructor(private priceConversionService: CurrencyConversionService) {
    this.pricelists = new Map<Currency, PriceListMap>();
    this.basePriceList = this.loadFixture();
  }

  private loadFixture(): PriceListMap {
    return getInitialProductPricingAsPriceListMap();
  }

  async getPriceList(priceListCurrency: Currency): Promise<PriceListMap> {
    const p = this.pricelists.get(priceListCurrency);
    if (p) {
      return p;
    }
    const converted = await this.priceConversionService.convertPriceList(
      this.basePriceList,
      priceListCurrency,
    );
    this.pricelists.set(priceListCurrency, converted);
    return converted;
  }

  /**
   * @param productId
   * @param currency
   */
  async getPriceInCurrency(
    productId: string,
    currency: Currency,
  ): Promise<Maybe<ProductPrice>> {
    const priceList = await this.getPriceList(currency);
    return priceList.get(productId);
  }
}
