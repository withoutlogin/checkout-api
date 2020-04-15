import { IMoneyData } from 'cart/cart-domain/valueobjects';
import { PriceListMap } from '../product-prices/product-pricing.service';
import { ProductPrice } from 'pricing/product-prices/product-price';
import Dinero from 'dinero.js';
import { ProductDataDto } from '../products/dto/product-data.dto';

export interface ProductPricingData {
  productId: string;
  price: IMoneyData;
  texts: {
    name: string;
    description: string;
  };
}
export const initialProductPricing: ProductPricingData[] = [
  {
    productId: 'cdb63720-9628-5ef6-bbca-2e5ce6094f3c',
    price: {
      amount: 5600,
      precision: 2,
      currency: 'USD',
    },
    texts: {
      name: 'Perfect jacket',
      description: 'Great jacket in khaki color.',
    },
  },
  {
    productId: '2680ee73-8661-4248-a1a0-b77799fc8cb4',
    price: {
      amount: 1400,
      precision: 2,
      currency: 'USD',
    },
    texts: {
      name: 'Nice shoes',
      description: 'A pair of very nice shoes.',
    },
  },
  {
    productId: '63b7fb2e-8d92-48a6-bb28-49510bdaa427',
    price: { amount: 899, precision: 2, currency: 'USD' },
    texts: {
      name: 'Simple scarf',
      description: 'Black scarf for autumn.',
    },
  },
];

export function getInitialProductPricingAsPriceListMap(): PriceListMap {
  const m = new Map<string, ProductPrice>();
  initialProductPricing.forEach((entry) => {
    m.set(
      entry.productId,
      new ProductPrice(entry.productId, Dinero(entry.price)),
    );
  });
  return m;
}

export function getInitialProductData(): ProductDataDto[] {
  return initialProductPricing.map((entry) => {
    return {
      id: entry.productId,
      name: entry.texts.name,
      description: entry.texts.description,
    };
  });
}
