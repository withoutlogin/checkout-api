import { IMoneyData } from '../valueobjects';

export class OrderProduct {
  constructor(
    public readonly productId: string,
    public readonly quantity: number,
    public readonly price: IMoneyData,
    public readonly name: string,
  ) {}
}
