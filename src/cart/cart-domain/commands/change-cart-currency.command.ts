import { Currency } from 'pricing/money';

export class ChangeCartCurrency {
  constructor(
    public readonly cartId: string,
    public readonly newCurrency: Currency,
  ) {}
}
