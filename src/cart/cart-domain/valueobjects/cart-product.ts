import { Money } from 'pricing/money';
import { DomainError } from 'common/ddd/errors';

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

  withAdded(nItems: number): CartProduct {
    return new CartProduct(this.productId, this.quantity + nItems, this.price);
  }

  withSubtracted(nItems: number): CartProduct {
    const destQuantity = this.quantity - nItems;
    if (destQuantity < 0) {
      throw new DomainError('Quantity cannot be negative.');
    }

    return new CartProduct(this.productId, destQuantity, this.price);
  }
}
