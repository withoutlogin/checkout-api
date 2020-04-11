import { CartProduct } from '../cart-product.model';

export class ProductAddedEvent {
  constructor(
    public readonly cartId: string,
    public readonly product: CartProduct,
  ) {}
}
