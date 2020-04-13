import { IMoneyData } from '../valueobjects/money';
import Dinero from 'dinero.js';
import { Money } from 'pricing/money';
import { CartProduct } from '../valueobjects/cart-product';

export class ProductAddedEvent {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly productPrice: IMoneyData,
  ) {}

  getPriceAsMoney(): Money {
    return Dinero(this.productPrice);
  }

  getCartProduct(): CartProduct {
    return new CartProduct(
      this.productId,
      this.quantity,
      this.getPriceAsMoney(),
    );
  }
}
