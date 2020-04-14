import { ESEvent } from 'common/event-sourcing/index';
import { Cart } from '../cart';

export class ProductQuantityUpdatedEvent extends ESEvent {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
    public readonly newQuantity: number,
  ) {
    super();
  }
  getEventName(): string {
    throw new Error('Method not implemented.');
  }

  getSubjectName(): string {
    return Cart.name;
  }
  getSubjectIdentifier(): string {
    return this.cartId;
  }
}
