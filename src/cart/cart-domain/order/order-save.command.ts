import { Order } from './order';
export class OrderSaveCommand {
  constructor(public readonly order: Order) {}
}
