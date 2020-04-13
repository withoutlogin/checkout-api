import { CartCurrency } from '../valueobjects/cart-currency';

export class CartCurrencyConversionRateChangedEvent {
  constructor(
    public readonly cartId: string,
    public readonly newCurrency: CartCurrency,
  ) {}
}
