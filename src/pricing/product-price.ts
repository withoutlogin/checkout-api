import { Money } from './money';

export class ProductPrice {
  constructor(
    public readonly productId: string,
    public readonly price: Money,
  ) {}
}
