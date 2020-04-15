import { Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { DomainError } from 'common/ddd/errors';
import { CartDomainTypes } from '../cart-domain.types';
import { ChangeProductQuantityCommand } from '../commands/change-product-quantity.command';
import { CartDomainRepository } from '../repositories/index';
import { CartNotFound } from '../errors';

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
