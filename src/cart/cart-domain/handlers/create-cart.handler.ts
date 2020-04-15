import { ConflictException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import Dinero from 'dinero.js';
import { Cart } from '../cart';
import { CreateCartCommand } from '../commands/create-cart.command';
import { CartDomainRepository } from '../repositories';
import { CartCurrency } from '../valueobjects/cart-currency';

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

    const cartCurrency = new CartCurrency(
      currency,
      Dinero({
        amount: 1,
        precision: 0,
        currency: 'USD',
      }),
    );

    const cart = this.publisher.mergeObjectContext(new Cart());
    cart.initialize(id, cartCurrency);
    cart.commit();
  }
}
