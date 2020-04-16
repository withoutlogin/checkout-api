import { OrderProduct } from './order-product';
import { Currency } from 'dinero.js';

export class Order {
  constructor(
    public readonly orderId: string,
    public readonly currency: Currency,
    public readonly products: OrderProduct[],
  ) {}
}
