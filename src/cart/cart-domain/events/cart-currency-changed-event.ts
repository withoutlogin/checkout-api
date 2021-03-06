import { DomainEvent } from 'common/ddd/interfaces';
import { ESEvent } from 'common/event-sourcing/index';
import { Cart } from '../cart';
import { CartProduct } from '../valueobjects';
import { Currency } from 'pricing/money';

export class CartCurrencyChangedEvent extends ESEvent implements DomainEvent {
  constructor(
    public readonly cartId: string,
    public readonly newCurrency: Currency,
    public readonly recalculatedCartProducts: CartProduct[],
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
