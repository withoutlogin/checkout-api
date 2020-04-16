import {
  CommandBus,
  CommandHandler,
  EventPublisher,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { Maybe } from 'common/ts-helpers';
import { CartProductsReadDto } from '../../cart-read-stack/dto/cart-products.dto';
import { CartProductsQuery } from '../../cart-read-stack/queries/cart-products.query';
import { Cart } from '../cart';
import { CartCheckoutCommand } from '../commands/cart-checkout.command';
import { CartNotFound } from '../errors/index';
import { OrderSaveCommand } from '../order/order-save.command';
import { OrderBuilder } from '../order/order.builder';
import { GetCartDomainModelQuery } from '../queries';

@CommandHandler(CartCheckoutCommand)
export class CartCheckoutCommandHandler
  implements ICommandHandler<CartCheckoutCommand> {
  constructor(
    private queryBus: QueryBus,
    private publisher: EventPublisher,
    private commandBus: CommandBus,
  ) {}

  async execute(command: CartCheckoutCommand): Promise<void> {
    const cart = (await this.queryBus.execute(
      new GetCartDomainModelQuery(command.cartId),
    )) as Maybe<Cart>;
    if (!cart) {
      throw new CartNotFound();
    }

    const aggregate = this.publisher.mergeObjectContext(cart);

    if (aggregate.canBeCheckedOut()) {
      aggregate.markAsCheckedOut();
      const builder = new OrderBuilder();
      const cartReadDto = (await this.queryBus.execute(
        new CartProductsQuery(command.cartId),
      )) as CartProductsReadDto;

      if (!cartReadDto) {
        throw new Error(
          'Unable to handle CartCheckoutCommand when no CartReadModel available.',
        );
      }

      const order = builder
        .withId(command.newOrderId)
        .withCurrency(cart.getCurrency())
        .withProducts(cartReadDto)
        .build();
      if (order) {
        await this.commandBus.execute(new OrderSaveCommand(order));
        aggregate.commit();
      } else {
        throw new Error('Order cannot be created! Should never happen.');
      }
    }
  }
}
