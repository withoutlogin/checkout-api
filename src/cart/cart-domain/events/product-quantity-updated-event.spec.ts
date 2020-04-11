import { ProductQuantityUpdatedEvent } from './product-quantity-updated-event';

describe('ProductQuantityUpdatedEvent', () => {
  it('should be defined', () => {
    expect(new ProductQuantityUpdatedEvent()).toBeDefined();
  });
});
