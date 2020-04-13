import { Injectable } from '@nestjs/common';
import Dinero from 'dinero.js';
import { productPrices } from '../data';
import { Currency } from '../money';
import { ProductPrice } from './product-price';

@Injectable()
export class ProductPricingService {
  // todo use external data access layer
  // @Inject(PricingTypes.PRICES_DAL) private pricesDb: IProductPricesDAL,
  constructor() {}

  async getPriceFor(productId: string): Promise<ProductPrice | undefined> {
    const entry = productPrices.find((entry) => entry.productId === productId);
    if (entry) {
      return new ProductPrice(entry.productId, Dinero(entry.price));
    }
  }

  /**
   * @param productId
   * @param currency
   */
  async getPriceInCurrency(
    productId: string,
    currency: Currency,
  ): Promise<ProductPrice | undefined> {
    const productPrice = await this.getPriceFor(productId);
    if (productPrice) {
      if (productPrice.price.getCurrency() === currency) {
        return productPrice;
      }
      const convertedPrice = await productPrice.price.convert(currency);
      return new ProductPrice(productPrice.productId, convertedPrice);
    }
  }

  async getAllPricesInCurrency(currency: Currency): Promise<ProductPrice[]> {
    return Promise.all(
      productPrices.map(
        async (entry): Promise<ProductPrice> => {
          let price = Dinero(entry.price);
          if (entry.price.currency !== currency) {
            price = await price.convert(currency);
          }
          return new ProductPrice(entry.productId, price);
        },
      ),
    );
  }
}
