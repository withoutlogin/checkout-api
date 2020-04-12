import { Currency } from '../../pricing/money';
export class CartReadDto {
  constructor(public readonly id: string, public readonly currency: Currency) {}
}
