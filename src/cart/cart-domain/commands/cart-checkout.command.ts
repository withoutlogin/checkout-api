import { ESEvent } from '../../../common/event-sourcing/index';
import { Cart } from '../cart';
export class CartCheckoutCommand extends ESEvent {
  getSubjectName(): string {
    return Cart.name;
  }
  getSubjectIdentifier(): string {
    return this.cartId;
  }
  constructor(
    public readonly cartId: string,
    public readonly newOrderId: string,
  ) {
    super();
  }
}
