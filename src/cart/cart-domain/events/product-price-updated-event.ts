import { ESEvent } from 'common/event-sourcing/index';
import { Cart } from '../cart';
import { IMoneyData } from '../valueobjects';

export class ProductPriceUpdatedEvent extends ESEvent {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
    public readonly newPrice: IMoneyData,
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
