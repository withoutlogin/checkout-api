import { ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import Dinero from 'dinero.js';
import { Cart } from '../cart';
import { CartDomainTypes } from '../cart-domain.types';
import { CreateCartCommand } from '../commands/create-cart.command';
import { ICartRepository } from '../repositories';
import { CartCurrency } from '../valueobjects/cart-currency';

@CommandHandler(CreateCartCommand)
export class CreateCartHandler implements ICommandHandler<CreateCartCommand> {
  constructor(
    @Inject(CartDomainTypes.CART_REPOSITORY)
    private cartRepository: ICartRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: CreateCartCommand): Promise<void> {
    const { id, currency } = command;
    let existing;
    try {
      existing = this.cartRepository.load(id);
    } catch (e) {
      if (!(e instanceof NotFoundException)) {
        throw e;
      }
    }

    if (existing) {
      throw new ConflictException();
    }

    const cartCurrency = new CartCurrency(
      currency,
      Dinero({
        amount: 1,
        precision: 1,
        currency: 'USD',
      }),
    );

    const cart = this.publisher.mergeObjectContext(new Cart());
    cart.initialize(id, cartCurrency);
    cart.commit();
  }
}
