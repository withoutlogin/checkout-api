import { Currency, Money } from '../../pricing/money';
import { IQueryResult } from '@nestjs/cqrs';
import Dinero from 'dinero.js';

export class CartReadDto implements IQueryResult {
  constructor(public readonly id: string, public readonly currency: Currency) {}
}

export class PriceDto {
  private constructor(
    public readonly currency: string,
    public readonly amount: number,
    public readonly formatted: string,
  ) {}

  static from(money: Money) {
    if (money.getPrecision() !== 2) {
      throw new Error('Argument precision != 2');
    }

    return new PriceDto(
      money.getCurrency(),
      money.getAmount(),
      money.toFormat(),
    );
  }
}

export class CartProductReadDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: PriceDto,
    public readonly quantity: number,
    public readonly description?: string,
  ) {}
}
