import { Currency } from 'pricing/money';
export class GetPriceForProductQuery {
  constructor(
    public readonly productId: string,
    public readonly currency: Currency,
  ) {}
}
