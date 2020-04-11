import { ProductAddedEvent } from './product-added-event';

describe('ProductAddedEvent', () => {
  it('should be defined', () => {
    expect(new ProductAddedEvent()).toBeDefined();
  });
});
