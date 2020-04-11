import { CartCurrency } from '../cart-currency.model';

export class CartCurrencyConversionRateChangedEvent {
  constructor(
    public readonly cartId: string,
    public readonly newCurrency: CartCurrency,
  ) {}
}
