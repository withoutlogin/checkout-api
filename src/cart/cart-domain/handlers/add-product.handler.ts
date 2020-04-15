import {
  CommandHandler,
  EventPublisher,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { GetPriceForProductQuery } from 'pricing/product-prices/queries';
import { DomainError } from '../../../common/ddd/errors';
import { Cart } from '../cart';
import { AddProductCommand } from '../commands/add-product.command';
import { GetCartDomainModelQuery } from '../queries';
import { CartProduct } from '../valueobjects/cart-product';
import { Money } from '../../../pricing/money';
import { Maybe } from 'common/ts-helpers';

@CommandHandler(AddProductCommand)
export class AddProductHandler implements ICommandHandler<AddProductCommand> {
  constructor(private queryBus: QueryBus, private publisher: EventPublisher) {}

  async execute(command: AddProductCommand): Promise<void> {
    const { productId, cartId, quantity } = command;

    const cartOrNothing = (await this.queryBus.execute(
      new GetCartDomainModelQuery(cartId),
    )) as Maybe<Cart>;

    if (!(cartOrNothing instanceof Cart)) {
      throw new DomainError(`Cart with id=${cartId} not found.`);
    }

    const cart = this.publisher.mergeObjectContext(cartOrNothing);
    const price = (await this.queryBus.execute(
      new GetPriceForProductQuery(productId),
    )) as Maybe<Money>;

    if (!price) {
      throw new DomainError(
        `Price for product with id=${productId} not found.`,
      );
    }

    const cartProduct = new CartProduct(productId, quantity, price);

    cart.addProduct(cartProduct);
    cart.commit();
  }
}
