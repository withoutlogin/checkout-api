import { CartCurrency } from '../valueobjects/cart-currency';
import { ESEvent } from 'common/event-sourcing/index';
import { DomainEvent } from 'common/ddd/interfaces';
import { Cart } from '../cart';

export class CartCurrencyConversionRateChangedEvent extends ESEvent
  implements DomainEvent {
  constructor(
    public readonly cartId: string,
    public readonly newCurrency: CartCurrency,
  ) {
    super();
  }
  getSubjectName(): string {
    return Cart.name;
  }
  getSubjectIdentifier(): string {
    return this.cartId;
  }
}
