import { CartProduct } from '../valueobjects/cart-product';

export class ProductAddedEvent {
  constructor(
    public readonly cartId: string,
    public readonly product: CartProduct,
  ) {}
}
