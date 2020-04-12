import { CartCurrency } from '../valueobjects/cart-currency';
import { DomainEvent } from 'common/ddd/interfaces';

export class CartCurrencyChangedEvent implements DomainEvent {
  constructor(
    public readonly cartId: string,
    public readonly newCurrency: CartCurrency,
  ) {}
}
