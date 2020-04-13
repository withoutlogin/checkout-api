import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CartDomainTypes } from '../cart-domain.types';
import { ChangeProductQuantityCommand } from '../commands/change-product-quantity-command';
import { ICartRepository } from '../repositories';
import { DomainError } from 'common/ddd/errors';

@CommandHandler(ChangeProductQuantityCommand)
export class ChangeProductQuantityHandler
  implements ICommandHandler<ChangeProductQuantityCommand> {
  constructor(
    @Inject(CartDomainTypes.CART_REPOSITORY)
    private cartRepository: ICartRepository,
  ) {}

  async execute(command: ChangeProductQuantityCommand): Promise<void> {
    const cart = await this.cartRepository.load(command.cartId);
    if (!cart) {
      throw new DomainError(`Cart with id=${command.cartId} not found.`);
    }

    return cart.changeProductQuantity(command.productId, command.newQuantity);
  }
}
