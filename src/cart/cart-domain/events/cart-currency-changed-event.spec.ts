import { CartCurrencyChangedEvent } from './cart-currency-changed-event';

describe('CartCurrencyChangedEvent', () => {
  it('should be defined', () => {
    expect(new CartCurrencyChangedEvent()).toBeDefined();
  });
});
