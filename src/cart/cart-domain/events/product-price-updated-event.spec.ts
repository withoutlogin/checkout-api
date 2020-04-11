import { ProductPriceUpdatedEvent } from './product-price-updated-event';

describe('ProductPriceUpdatedEvent', () => {
  it('should be defined', () => {
    expect(new ProductPriceUpdatedEvent()).toBeDefined();
  });
});
