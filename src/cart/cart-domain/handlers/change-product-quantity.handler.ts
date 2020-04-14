import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CartDomainTypes } from '../cart-domain.types';
import { ChangeProductQuantityCommand } from '../commands/change-product-quantity.command';
import { ICartRepository } from '../repositories';
import { DomainError } from 'common/ddd/errors';

@CommandHandler(ChangeProductQuantityCommand)
export class ChangeProductQuantityHandler
  implements ICommandHandler<ChangeProductQuantityCommand> {
  constructor(
    @Inject(CartDomainTypes.CART_REPOSITORY)
    private cartRepository: ICartRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: ChangeProductQuantityCommand): Promise<void> {
    const { cartId, productId, newQuantity } = command;

    const cart = this.publisher.mergeObjectContext(
      await this.cartRepository.load(cartId),
    );

    if (!cart) {
      throw new DomainError(`Cart with id=${cartId} not found.`);
    }

    cart.changeProductQuantity(productId, newQuantity);
    cart.commit();
  }
}
