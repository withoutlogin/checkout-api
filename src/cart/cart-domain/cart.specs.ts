import { Cart } from './cart';
import { CartCurrency } from './valueobjects/cart-currency';
import Dinero from 'dinero.js';

describe('Cart Entity', () => {
  it('should call apply method when committing', () => {
    const c = new Cart(
      '213',
      new CartCurrency(
        'PLN',
        Dinero({ amount: 1, precision: 1, currency: 'PLN' }),
      ),
      new Map(),
    );
  });
});
