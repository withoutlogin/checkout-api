import { ConflictException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { Cart } from '../cart';
import { CreateCartCommand } from '../commands/create-cart.command';
import { CartDomainRepository } from '../repositories';

@CommandHandler(CreateCartCommand)
export class CreateCartHandler implements ICommandHandler<CreateCartCommand> {
  constructor(
    private publisher: EventPublisher,
    private cartRepository: CartDomainRepository,
  ) {}

  async execute(command: CreateCartCommand): Promise<void> {
    const { id, currency } = command;
    const existing = await this.cartRepository.load(id);
    if (existing) {
      throw new ConflictException();
    }

    const cart = this.publisher.mergeObjectContext(new Cart());
    cart.initialize(id, currency);
    cart.commit();
  }
}
