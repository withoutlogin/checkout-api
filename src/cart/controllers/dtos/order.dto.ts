import { Currency } from 'dinero.js';
import { IMoneyData } from 'cart/cart-domain/valueobjects';
import { ApiProperty } from '@nestjs/swagger';
import { OrderProduct } from '../../cart-domain/order/order-product';

export interface OrderSummary {
  valueWithCurrencyConverted: IMoneyData;
  itemsCount: number;
}

export class OrderDto {
  @ApiProperty()
  id!: string;
  @ApiProperty()
  currency!: Currency;
  @ApiProperty()
  totals!: OrderSummary;

  @ApiProperty({ type: [OrderProduct] })
  products!: OrderProduct[];

  constructor(
    id: string,
    currency: Currency,
    totals: OrderSummary,
    products: OrderProduct[],
  ) {
    this.id = id;
    this.currency = currency;
    this.totals = totals;
    this.products = products;
  }
}
