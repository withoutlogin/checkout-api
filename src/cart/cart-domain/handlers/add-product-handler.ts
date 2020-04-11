import { AddProductCommand } from '../commands/add-product-command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ICartRepository } from '../cart-repository.interface';
import { CartDomainTypes } from '../cart-domain.types';

@CommandHandler(AddProductCommand)
export class AddProductHandler implements ICommandHandler<AddProductCommand> {
  constructor(
    @Inject(CartDomainTypes.REPOSITORY) private cartRepository: ICartRepository,
  ) {}

  async execute(command: AddProductCommand): Promise<void> {
    await this.cartRepository.load(command.cartId);
    // todo stuff
  }
}
