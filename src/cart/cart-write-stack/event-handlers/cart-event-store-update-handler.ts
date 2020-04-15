import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ESEvent } from 'common/event-sourcing';
import { IEventSourcingStore } from '../../../common/event-sourcing/index';
import { Inject, Logger } from '@nestjs/common';
import { CartWriteStackTypes } from 'cart/cart-write-stack/cart-write-stack.types';
import { domainEvents } from 'cart/cart-domain/events';

@EventsHandler(...domainEvents)
export class CartEventStoreUpdateHandler implements IEventHandler<ESEvent> {
  private logger = new Logger(CartEventStoreUpdateHandler.name);

  constructor(
    @Inject(CartWriteStackTypes.EVENT_SOURCING_STORE)
    private eventSourcingStore: IEventSourcingStore,
  ) {}

  handle(event: ESEvent) {
    this.eventSourcingStore.addEvent(event);
  }
}
