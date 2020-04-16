import { Currency } from 'pricing/money';

export class ChangeCartCurrencyCommand {
  constructor(
    public readonly cartId: string,
    public readonly newCurrency: Currency,
  ) {}
}
