import { Cart } from './cart';
import { v4 as uuidv4 } from 'uuid';
import { CartCurrency } from './valueobjects/cart-currency';
import Dinero from 'dinero.js';
import { CartProduct } from './valueobjects/cart-product';

describe('Cart', () => {
  it('Returns products by id', () => {
    const cartProduct = new CartProduct(
      uuidv4(),
      2,
      Dinero({ amount: 799, precision: 2, currency: 'USD' }),
    );

    const products = new Map<string, CartProduct>();
    products.set(cartProduct.productId, cartProduct);

    const cart = new Cart(
      uuidv4(),
      new CartCurrency('USD', Dinero({ amount: 1, currency: 'USD' })),
      products,
    );

    expect(
      cart.getProduct(cartProduct.productId)?.equalsTo(cartProduct),
    ).toBeTruthy();
    expect(cart.getProduct(uuidv4())).toBeUndefined();
  });
});
