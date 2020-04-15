import { CartProduct, IMoneyData } from '../valueobjects';
import Dinero from 'dinero.js';
import { Money } from 'pricing/money';
import { ESEvent } from 'common/event-sourcing/index';
import { Cart } from '../cart';

export class ProductAddedEvent extends ESEvent {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly productPrice: IMoneyData,
  ) {
    super();
  }

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
  getSubjectName(): string {
    return Cart.name;
  }
  getSubjectIdentifier(): string {
    return this.cartId;
  }
}
