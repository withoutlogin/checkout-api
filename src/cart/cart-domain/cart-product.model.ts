import { Money } from './cart-domain.types';

// implements ValueObject<CartProduct>
export class CartProduct {
  constructor(
    public readonly id: string,
    public readonly quantity: number,
    public readonly price: Money,
  ) {}
}
