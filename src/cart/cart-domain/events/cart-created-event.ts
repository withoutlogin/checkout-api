import { ESEvent } from 'common/event-sourcing';
import { Cart } from '../cart';
import { IMoneyData } from '../valueobjects';
import { Currency } from 'pricing/money';
export class CartCreatedEvent extends ESEvent {
  constructor(
    public readonly cartId: string,
    public readonly cartCurrencyName: Currency,
    public readonly cartCurrencyConversionRate: IMoneyData,
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
