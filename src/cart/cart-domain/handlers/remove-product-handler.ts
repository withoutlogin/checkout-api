import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CartDomainTypes } from '../cart-domain.types';
import { ICartRepository } from '../repositories';
import { CartNotFound } from '../errors';
import { RemoveProductCommand } from '../commands/remove-product-command';

@CommandHandler(RemoveProductCommand)
export class RemoveProductHandler
  implements ICommandHandler<RemoveProductCommand> {
  constructor(
    @Inject(CartDomainTypes.CART_REPOSITORY)
    private cartRepository: ICartRepository,
  ) {}

  async execute(command: RemoveProductCommand): Promise<void> {
    const cart = await this.cartRepository.load(command.cartId);
    if (!cart) {
      throw new CartNotFound(command.cartId);
    }

    cart.removeProduct(command.productId);
  }
}
