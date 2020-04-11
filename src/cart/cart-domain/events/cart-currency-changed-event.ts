import { CartCurrency } from '../cart-currency.model';

export class CartCurrencyChangedEvent {
  constructor(
    public readonly cartId: string,
    public readonly newCurrency: CartCurrency,
  ) {}
}
