import { Cart } from '../cart';
import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCartDomainModelQuery } from '../queries';
import { Maybe } from 'common/ts-helpers';

@Injectable()
export class CartDomainRepository {
  private logger = new Logger(CartDomainRepository.name);
  constructor(private queryBus: QueryBus) {}

  async load(cartId: string): Promise<Cart | undefined> {
    const cartOrNothing = (await this.queryBus.execute(
      new GetCartDomainModelQuery(cartId),
    )) as Maybe<Cart>;

    if (cartOrNothing instanceof Cart) {
      return cartOrNothing;
    } else if (cartOrNothing) {
      this.logger.error('Unexpected GetCartDomainModelQuery result');
      this.logger.error(cartOrNothing);

      throw new Error(
        'Failed to load Cart using GetCartDomainModelQuery. Unexpected type returned.',
      );
    }

    return;
  }
}
