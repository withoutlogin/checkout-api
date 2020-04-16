import { Injectable } from '@nestjs/common';
import Dinero from 'dinero.js';
import { ProductPrice } from './product-price';
import { Maybe } from 'common/ts-helpers';
import { initialProductPricing } from 'pricing/fixtures/initial-product-pricing-and-texts';
import { Currency } from 'pricing/money';
import { CurrencyConversionService } from 'pricing/currency-conversion/currency-conversion.service';
import { getInitialProductPricingAsPriceListMap } from '../fixtures/initial-product-pricing-and-texts';

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
