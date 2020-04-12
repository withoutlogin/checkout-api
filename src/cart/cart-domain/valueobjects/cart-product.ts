import { Money } from 'pricing/money';

// implements ValueObject<CartProduct>
export class CartProduct {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: Money,
  ) {}

  equalsTo(another: CartProduct): boolean {
    return (
      this.productId === another.productId &&
      this.quantity === another.quantity &&
      this.price.equalsTo(another.price)
    );
  }
}
