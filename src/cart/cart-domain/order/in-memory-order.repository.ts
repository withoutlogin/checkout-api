import { Injectable } from '@nestjs/common';
import { Maybe } from 'common/ts-helpers';
import { Order } from './order';

@Injectable()
export class InMemoryOrderRepository {
  private storage: Map<string, Order> = new Map();

  async load(orderId: string): Promise<Maybe<Order>> {
    return this.storage.get(orderId);
  }

  async store(order: Order): Promise<void> {
    this.storage.set(order.orderId, order);
  }
}
