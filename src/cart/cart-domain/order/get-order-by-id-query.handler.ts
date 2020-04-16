import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderByIdQuery } from './get-order-by-id.query';
import { InMemoryOrderRepository } from './in-memory-order.repository';
import { Order } from './order';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdQueryHandler
  implements IQueryHandler<GetOrderByIdQuery> {
  constructor(private orderRepository: InMemoryOrderRepository) {}

  async execute(query: GetOrderByIdQuery): Promise<Order> {
    const order = await this.orderRepository.load(query.orderId);
    if (order) {
      return order;
    }
    throw new NotFoundException();
  }
}
