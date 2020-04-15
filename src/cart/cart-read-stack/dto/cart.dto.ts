import { Currency } from 'pricing/money';
import { IMoneyData } from 'cart/cart-domain/valueobjects';
import { ApiProperty } from '@nestjs/swagger';
import { IMoneyDataDto } from './cart-products.dto';

export interface CartTotals {
  valueWithCurrencyConverted: IMoneyData;
  itemsCount: number;
}

export class CartTotalsDto implements CartTotals {
  @ApiProperty({ type: IMoneyDataDto })
  valueWithCurrencyConverted!: IMoneyData;
  @ApiProperty()
  itemsCount!: number;
}
export class CartReadDto {
  @ApiProperty({ example: 'eb261ef2-da87-41c3-8005-dad1cf2d7438' })
  cartId: string;
  @ApiProperty()
  currency: string;
  @ApiProperty({
    type: IMoneyDataDto,
    example: { amount: 1, precision: 0, currency: 'USD' },
  })
  conversionRate: IMoneyData;
  @ApiProperty({ type: CartTotalsDto })
  totals: CartTotals;

  constructor(
    cartId: string,
    currency: Currency,
    conversionRate: IMoneyData,
    totals: CartTotals = {
      valueWithCurrencyConverted: {
        amount: 0,
        precision: 2,
        currency: currency,
      },
      itemsCount: 0,
    },
  ) {
    this.cartId = cartId;
    this.currency = currency;
    this.conversionRate = conversionRate;
    this.totals = totals;
  }
}
