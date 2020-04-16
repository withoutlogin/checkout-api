import {
  CommandHandler,
  EventPublisher,
  ICommandHandler,
  QueryBus,
} from '@nestjs/cqrs';
import { CartNotFound } from '../errors';
import { CartDomainRepository } from '../repositories/index';
import { CartProduct } from '../valueobjects';
import { GetPriceForProductQuery } from '../../../pricing/queries/index';
import { ChangeCartCurrency } from '../commands/change-cart-currency.command';
import { ProductPrice } from 'pricing/product-prices/product-price';
import { Maybe } from 'common/ts-helpers';
import { PriceForProductUnknownError } from '../errors/index';
import { Logger } from '@nestjs/common';

@CommandHandler(ChangeCartCurrency)
export class ChangeCartCurrencyHandler
  implements ICommandHandler<ChangeCartCurrency> {
  private logger = new Logger(ChangeCartCurrencyHandler.name);
  constructor(
    private cartRepository: CartDomainRepository,
    private publisher: EventPublisher,
    private queryBus: QueryBus,
  ) {}

  async execute(command: ChangeCartCurrency): Promise<void> {
    const { cartId, newCurrency } = command;
    const cart = await this.cartRepository.load(cartId);
    if (!cart) {
      throw new CartNotFound(cartId);
    }

    const cartAggregate = this.publisher.mergeObjectContext(cart);

    const products = cartAggregate.getProducts();
    const promises: Promise<ProductPrice>[] = products.map(
      async (p): Promise<ProductPrice> => {
        const price = (await this.queryBus.execute(
          new GetPriceForProductQuery(p.productId, newCurrency),
        )) as Maybe<ProductPrice>;
        if (!price) {
          throw new PriceForProductUnknownError(
            `Cannot change currency of cart. There are products that cannot be converted to ${newCurrency}`,
          );
        }
        return price;
      },
    );

    try {
      const newPrices = await Promise.all(promises);
      newPrices.forEach((price) => {
        const product = cartAggregate.getProduct(price.productId);
        cartAggregate.changeCurrency;
      });

      cartAggregate.commit();
    } catch (e) {
      if (e instanceof PriceForProductUnknownError) {
        this.logger.error('Failed to get price for at least one product');
        this.logger.error(e);
        throw e;
      }
    }
  }
}
