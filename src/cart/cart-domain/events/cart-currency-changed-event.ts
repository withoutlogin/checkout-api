import { CartCurrency } from '../valueobjects/cart-currency';
import { DomainEvent } from 'common/ddd/interfaces';
import { ESEvent } from 'common/event-sourcing/index';
import { Cart } from '../cart';

export class CartCurrencyChangedEvent extends ESEvent implements DomainEvent {
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
