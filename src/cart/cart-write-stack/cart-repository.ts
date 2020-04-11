import { ICartRepository } from '../cart-domain/cart-repository.interface';
import { Cart } from '../cart-domain/cart.model';
import { CartCurrency } from '../cart-domain/cart-currency.model';
import Dinero from 'dinero.js';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CartRepository implements ICartRepository {
  async load(cartId: string): Promise<Cart> {
    const cartCurrency = new CartCurrency(
      'PLN',
      Dinero({ amount: 1, currency: 'PLN', precision: 1 }),
    );
    const c = new Cart(cartId, cartCurrency, []);
    return c;
  }
}
