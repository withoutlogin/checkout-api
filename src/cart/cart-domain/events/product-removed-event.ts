import { ESEvent } from 'common/event-sourcing/index';
import { Cart } from '../cart';

export class ProductRemovedEvent extends ESEvent {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
    public readonly removedQuantity: number,
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
