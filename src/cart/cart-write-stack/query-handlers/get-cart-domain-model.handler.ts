import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCartDomainModelQuery } from '../../cart-domain/queries/get-cart-domain-model.query';
import { CartEventStoreBasedRepository } from '../cart-repository/cart-repository';

@QueryHandler(GetCartDomainModelQuery)
export class CartDomainModelQueryHandler
  implements IQueryHandler<GetCartDomainModelQuery> {
  constructor(private repo: CartEventStoreBasedRepository) {}
  execute(query: GetCartDomainModelQuery): Promise<any> {
    return this.repo.load(query.cartId);
  }
}
