import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from 'cart/cart-domain/cart';
import { ICartRepository } from 'cart/cart-domain/repositories';
import { IEventSourcingStore } from 'common/event-sourcing';
import { CartCreatedEvent } from '../../cart-domain/events/cart-created-event';
import { CartWriteStackTypes } from '../cart-write-stack.types';
import { DataCorruptedError } from './errors';

@Injectable()
export class CartRepository implements ICartRepository {
  constructor(
    @Inject(CartWriteStackTypes.EVENT_SOURCING_STORE)
    private eventStore: IEventSourcingStore,
  ) {}
  async load(cartId: string): Promise<Cart> {
    const events = await this.eventStore.getEventsFor(Cart.name, cartId);
    if (!events.length) {
      throw new NotFoundException();
    }

    if (!(events[0] instanceof CartCreatedEvent)) {
      throw new DataCorruptedError(
        'Unable to recreate Cart from given event store.',
      );
    }

    const c = new Cart();
    events.forEach((ev) => c.apply(ev, true));
    return c;
  }
}
