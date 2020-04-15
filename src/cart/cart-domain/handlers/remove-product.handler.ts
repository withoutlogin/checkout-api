import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CartNotFound } from '../errors';
import { RemoveProductCommand } from '../commands/remove-product.command';
import { CartDomainRepository } from '../repositories/index';

@CommandHandler(RemoveProductCommand)
export class RemoveProductHandler
  implements ICommandHandler<RemoveProductCommand> {
  constructor(
    private cartRepository: CartDomainRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: RemoveProductCommand): Promise<void> {
    const cart = await this.cartRepository.load(command.cartId);
    if (!cart) {
      throw new CartNotFound(command.cartId);
    }

    const cartAggregate = this.publisher.mergeObjectContext(cart);
    cartAggregate.removeProduct(command.productId);
    cartAggregate.commit();
  }
}
