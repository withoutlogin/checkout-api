import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CartDomainTypes } from '../cart-domain.types';
import { ChangeProductQuantityCommand } from '../commands/change-product-quantity-command';
import { ICartRepository } from '../cart-repository.interface';

@CommandHandler(ChangeProductQuantityCommand)
export class ChangeProductQuantityHandler
  implements ICommandHandler<ChangeProductQuantityCommand> {
  constructor(
    @Inject(CartDomainTypes.REPOSITORY) private cartRepository: ICartRepository,
  ) {}

  async execute(command: ChangeProductQuantityCommand): Promise<void> {
    await this.cartRepository.load(command.cartId);
    // todo stuff
  }
}
