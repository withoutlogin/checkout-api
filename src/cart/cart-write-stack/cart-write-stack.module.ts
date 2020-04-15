import { Module } from '@nestjs/common';
import { CartDomainTypes } from '../cart-domain/cart-domain.types';
import { CqrsModule } from '@nestjs/cqrs';
import { CartEventStoreUpdateHandler } from './event-handlers/cart-event-store-update-handler';
import { CartWriteStackTypes } from './cart-write-stack.types';
import { IEventSourcingStore } from 'common/event-sourcing';
import { SimpleEventSourcingStore } from './cart-repository/infrastructure/simple-event-sourcing-store';
import { CartEventStoreBasedRepository } from './cart-repository/cart-repository';

import { eventHandlers } from './event-handlers';
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
