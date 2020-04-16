import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { commands } from './commands';
import { commandHandlers } from './handlers';
import { CartDomainRepository } from './repositories';
import { GetOrderByIdQueryHandler } from './order/get-order-by-id-query.handler';
import { OrderSaveCommandHandler } from './order/order-save-command.handler';
import { InMemoryOrderRepository } from './order/in-memory-order.repository';
import { CartCheckoutCommandHandler } from './handlers/cart-checkout.handler';

@Module({
  imports: [CqrsModule],
  providers: [
    ...commands,
    ...commandHandlers,
    CartDomainRepository,

    OrderSaveCommandHandler,
    GetOrderByIdQueryHandler,
    InMemoryOrderRepository,
    CartCheckoutCommandHandler,
  ],
})
export class CartDomainModule {}
