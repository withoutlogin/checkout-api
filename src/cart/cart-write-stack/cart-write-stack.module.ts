import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { IEventSourcingStore } from 'common/event-sourcing';
import { CartEventStoreBasedRepository } from './cart-repository/cart-repository';
import { SimpleEventSourcingStore } from './cart-repository/infrastructure/simple-event-sourcing-store';
import { CartWriteStackTypes } from './cart-write-stack.types';
import { eventHandlers } from './event-handlers';
import { CartEventStoreUpdateHandler } from './event-handlers/cart-event-store-update-handler';
import { queryHandlers } from './query-handlers';

@Module({
  imports: [CqrsModule],
  providers: [
    ...eventHandlers,
    ...queryHandlers,
    CartEventStoreBasedRepository,
    CartEventStoreUpdateHandler,
    {
      provide: CartWriteStackTypes.EVENT_SOURCING_STORE,
      useFactory: (): IEventSourcingStore => {
        return new SimpleEventSourcingStore([]);
      },
    },
  ],
})
export class CartWriteStackModule {}
