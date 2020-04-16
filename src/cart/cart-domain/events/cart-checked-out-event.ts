import { ESEvent } from '../../../common/event-sourcing/index';
import { Cart } from '../cart';

export class CartCheckedOutEvent extends ESEvent {
  constructor(public readonly cartId: string) {
    super();
  }
  getSubjectName(): string {
    return Cart.name;
  }
  getSubjectIdentifier(): string {
    return this.cartId;
  }
}
