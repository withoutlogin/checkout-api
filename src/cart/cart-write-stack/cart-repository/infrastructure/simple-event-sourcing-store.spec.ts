import { Cart } from 'cart/cart-domain/cart';
import { v4 as uuidv4 } from 'uuid';
import { ProductAddedEvent } from '../../../cart-domain/events/product-added-event';
import { SimpleEventSourcingStore } from './simple-event-sourcing-store';
describe('SimpleEventSourcingStore', () => {
  it('should return events filtered by proper id', async (done) => {
    const firstId = uuidv4();
    const secondId = uuidv4();
    const store = new SimpleEventSourcingStore();

    const ev1 = new ProductAddedEvent(firstId, uuidv4(), 3, {
      amount: 100,
      precision: 2,
      currency: 'USD',
    });
    const ev2 = new ProductAddedEvent(secondId, uuidv4(), 3, {
      amount: 100,
      precision: 2,
      currency: 'USD',
    });

    await store.addEvent(ev1);
    await store.addEvent(ev2);

    expect(await store.getEventsFor(Cart.name, firstId)).toEqual([ev1]);
    expect(await store.getEventsFor(Cart.name, secondId)).toEqual([ev2]);
    expect(await store.getEventsFor(Cart.name, uuidv4())).toEqual([]);
    done();
  });
});
