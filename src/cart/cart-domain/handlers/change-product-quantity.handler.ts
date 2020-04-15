import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { ChangeProductQuantityCommand } from '../commands/change-product-quantity.command';
import { CartNotFound } from '../errors';
import { CartDomainRepository } from '../repositories/index';

@CommandHandler(ChangeProductQuantityCommand)
export class ChangeProductQuantityHandler
  implements ICommandHandler<ChangeProductQuantityCommand> {
  constructor(
    private cartRepository: CartDomainRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: ChangeProductQuantityCommand): Promise<void> {
    const { cartId, productId, newQuantity } = command;
    const cart = await this.cartRepository.load(cartId);
    if (!cart) {
      throw new CartNotFound(cartId);
    }

    const cartAggregate = this.publisher.mergeObjectContext(cart);
    cartAggregate.changeProductQuantity(productId, newQuantity);
    cartAggregate.commit();
  }
}
