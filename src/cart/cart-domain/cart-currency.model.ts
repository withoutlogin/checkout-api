import { Money } from './cart-domain.types';

export class CartCurrency {
  constructor(
    public readonly currency: string,
    public readonly conversionRate: Money,
  ) {}

  equalsTo(another: CartCurrency) {
    return (
      this.currency === another.currency &&
      this.conversionRate.equalsTo(another.conversionRate)
    );
  }
}
