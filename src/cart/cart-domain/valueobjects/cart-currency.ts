import { Money, Currency } from 'pricing/money';

export class CartCurrency {
  constructor(
    public readonly currency: Currency,
    public readonly conversionRate: Money,
  ) {}

  equalsTo(another: CartCurrency) {
    return (
      this.currency === another.currency &&
      this.conversionRate.equalsTo(another.conversionRate)
    );
  }
}
