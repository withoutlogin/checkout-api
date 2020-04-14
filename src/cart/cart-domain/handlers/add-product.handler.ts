import { AddProductCommand } from '../commands/add-product.command';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CartDomainTypes } from '../cart-domain.types';
import { CartProduct } from '../valueobjects/cart-product';
import { DomainError } from '../../../common/ddd/errors';
import { ICartRepository, IPricingRepository } from '../repositories';

@CommandHandler(AddProductCommand)
export class AddProductHandler implements ICommandHandler<AddProductCommand> {
  constructor(
    @Inject(CartDomainTypes.CART_REPOSITORY)
    private cartRepository: ICartRepository,
    @Inject(CartDomainTypes.PRICING_REPOSITORY)
    private pricingService: IPricingRepository,
    private publisher: EventPublisher,
  ) {}

  async execute(command: AddProductCommand): Promise<void> {
    const cart = this.publisher.mergeObjectContext(
      await this.cartRepository.load(command.cartId),
    );
    if (!cart) {
      throw new DomainError(`Cart with id=${command.cartId} not found.`);
    }

    const price = await this.pricingService.getProductPrice(command.productId);
    if (!price) {
      throw new DomainError(
        `Price for product with id=${command.productId} not found.`,
      );
    }

    const cartProduct = new CartProduct(
      command.productId,
      command.quantity,
      price,
    );

    cart.addProduct(cartProduct);
    cart.commit();
  }
}
