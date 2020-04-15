import { CartCreatedEvent } from 'cart/cart-domain/events/cart-created-event';
import { ESEvent } from 'common/event-sourcing';
import { ProductAddedEvent } from '../cart-domain/events/product-added-event';
import { ProductQuantityUpdatedEvent } from '../cart-domain/events/product-quantity-updated-event';
import { ProductRemovedEvent } from '../cart-domain/events/product-removed-event';

const cartId = 'eb261ef2-da87-41c3-8005-dad1cf2d7438';
const firstProductId = '2680ee73-8661-4248-a1a0-b77799fc8cb4';
const secondProductId = '63b7fb2e-8d92-48a6-bb28-49510bdaa427';

export const initialCartStateEvents: ESEvent[] = [
  new CartCreatedEvent(cartId, 'USD', {
    amount: 1,
    precision: 0,
    currency: 'USD',
  }),
  new ProductAddedEvent(cartId, firstProductId, 6, {
    amount: 1400,
    precision: 2,
    currency: 'USD',
  }),
  new ProductAddedEvent(cartId, firstProductId, 4, {
    amount: 1400,
    precision: 2,
    currency: 'USD',
  }),
  new ProductAddedEvent(cartId, secondProductId, 1, {
    amount: 899,
    precision: 2,
    currency: 'USD',
  }),
];
