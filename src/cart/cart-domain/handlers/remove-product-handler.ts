import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ICartRepository } from '../cart-repository.interface';
import { CartDomainTypes } from '../cart-domain.types';
import { RemoveProductCommand } from '../commands/remove-product-command';

@CommandHandler(RemoveProductCommand)
export class RemoveProductHandler
  implements ICommandHandler<RemoveProductCommand> {
  constructor(
    @Inject(CartDomainTypes.REPOSITORY) private cartRepository: ICartRepository,
  ) {}

  async execute(command: RemoveProductCommand): Promise<void> {
    await this.cartRepository.load(command.cartId);
    // todo stuff
  }
}
