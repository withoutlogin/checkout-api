import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { CartByIdQuery } from '../cart-by-id.query';
import { Inject } from '@nestjs/common';
import { CartReadStackTypes } from 'cart/cart-read-stack/cart-read-stack.types';
import { ICartReadRepository } from 'cart/cart-read-stack/repositories/interfaces';
import { CartReadDto } from '../../dto/cart.dto';

@QueryHandler(CartByIdQuery)
export class CartByIdQueryHandler implements IQueryHandler<CartByIdQuery> {
  constructor(
    @Inject(CartReadStackTypes.CART_READ_REPOSITORY)
    private repo: ICartReadRepository,
  ) {}

  execute(query: CartByIdQuery): Promise<CartReadDto | undefined> {
    return this.repo.getById(query.cartId);
  }
}
