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

  constructor(cartId: string, currency: Currency) {
    this.cartId = cartId;
    this.currency = currency;
  }
}
