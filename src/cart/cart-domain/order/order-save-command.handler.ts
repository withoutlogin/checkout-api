import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { OrderSaveCommand } from './order-save.command';
import { InMemoryOrderRepository } from './in-memory-order.repository';

@CommandHandler(OrderSaveCommand)
export class OrderSaveCommandHandler
  implements ICommandHandler<OrderSaveCommand> {
  constructor(private orderRepository: InMemoryOrderRepository) {}

  async execute(command: OrderSaveCommand): Promise<void> {
    console.log('order save handler');
    await this.orderRepository.store(command.order);
  }
}
