import { ProductRemovedEvent } from './product-removed-event';

describe('ProductRemovedEvent', () => {
  it('should be defined', () => {
    expect(new ProductRemovedEvent()).toBeDefined();
  });
});
