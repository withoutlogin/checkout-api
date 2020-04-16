import { Controller, Param, Get, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetOrderByIdQuery } from '../cart-domain/order/get-order-by-id.query';
import { Order } from 'cart/cart-domain/order/order';
import { Maybe } from 'common/ts-helpers';
import { OrderDto } from './dtos/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private queryBus: QueryBus) {}

  @Get(':orderId')
  async getOrderById(@Param('orderId') orderId: string): Promise<OrderDto> {
    const order = (await this.queryBus.execute(
      new GetOrderByIdQuery(orderId),
    )) as Maybe<Order>;

    if (order) {
      return new OrderDto(
        order.orderId,
        order.currency,
        order.getTotals(),
        order.products,
      );
    }

    throw new NotFoundException();
  }
}
