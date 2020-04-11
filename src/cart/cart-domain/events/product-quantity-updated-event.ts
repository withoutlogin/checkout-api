import { CartProduct } from '../cart-product.model';

export class ProductQuantityUpdatedEvent {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
    public readonly newQuantity: number,
  ) {}
}
