import { CartCurrency } from './cart-currency';
import Dinero from 'dinero.js';

describe('CartCurrency', () => {
  it('Should not be equal if currency is different', () => {
    const pln = new CartCurrency(
      'PLN',
      Dinero({ amount: 1, precision: 1, currency: 'PLN' }),
    );
    const eur = new CartCurrency(
      'EUR',
      Dinero({ amount: 450, precision: 2, currency: 'PLN' }),
    );

    expect(pln.equalsTo(eur)).toBe(false);
  });

  it('Should not be equal if conversion rate is different', () => {
    const pln = new CartCurrency(
      'EUR',
      Dinero({ amount: 445, precision: 2, currency: 'PLN' }),
    );
    const eur = new CartCurrency(
      'EUR',
      Dinero({ amount: 450, precision: 2, currency: 'PLN' }),
    );

    expect(pln.equalsTo(eur)).toBe(false);
  });

  it('Should be equal when currency and conversion rate are the same', () => {
    const pln = new CartCurrency(
      'EUR',
      Dinero({ amount: 450, precision: 2, currency: 'PLN' }),
    );
    const eur = new CartCurrency(
      'EUR',
      Dinero({ amount: 450, precision: 2, currency: 'PLN' }),
    );

    expect(pln.equalsTo(eur)).toBe(true);
  });
});
