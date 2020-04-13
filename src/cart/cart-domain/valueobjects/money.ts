import { Currency } from 'pricing/money';

export interface IMoneyData {
  amount: number;
  precision: number;
  currency: Currency;
}
