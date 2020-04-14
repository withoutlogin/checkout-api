import { Currency } from 'pricing/money';
import { IMoneyData } from 'cart/cart-domain/valueobjects';

export interface CartTotals {
  valueWithCurrencyConverted: IMoneyData;
  itemsCount: number;
}

export class CartReadDto {
  constructor(
    public readonly cartId: string,
    public readonly currency: Currency,
    public readonly conversionRate: IMoneyData,
    public readonly totals: CartTotals,
  ) {}
}
