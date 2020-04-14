import { CartProductsQuery } from '../cart-products.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CartReadStackTypes } from '../../cart-read-stack.types';
import { ICartProductsReadRepository } from 'cart/cart-read-stack/repositories/interfaces';

@QueryHandler(CartProductsQuery)
export class CartProductsQueryHandler
  implements IQueryHandler<CartProductsQuery> {
  constructor(
    @Inject(CartReadStackTypes.CART_PRODUCTS_READ_REPOSITORY)
    private repo: ICartProductsReadRepository,
  ) {}
  async execute(query: CartProductsQuery): Promise<any> {
    return this.repo.getForCartId(query.cartId);
  }
}
