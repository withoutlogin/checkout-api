import { Injectable } from '@nestjs/common';
import { ICartRepository } from 'cart/cart-domain/repositories';
import { Cart } from 'cart/cart-domain/cart';
import { CartCurrency } from 'cart/cart-domain/valueobjects/cart-currency';
import Dinero from 'dinero.js';
import { CartProduct } from '../cart-domain/valueobjects/cart-product';

@Injectable()
export class CartRepository implements ICartRepository {
  async load(cartId: string): Promise<Cart> {
    const cartCurrency = new CartCurrency(
      'PLN',
      Dinero({ amount: 1, currency: 'PLN', precision: 1 }),
    );
    const products = new Map<string, CartProduct>();

    const c = new Cart(cartId, cartCurrency, products);
    return c;
  }

  async store(cart: Cart): Promise<void> {
    const events = cart.getUncommittedEvents();
  }
}
