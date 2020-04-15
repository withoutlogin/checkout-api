import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CartReadStackTypes } from './cart-read-stack.types';
import {
  InMemoryCartProductsRepository,
  InMemoryCartRepository,
} from './repositories/impl';
import { QueryHandlers } from './queries';
import { CartReadRepositoryUpdateHandler } from './repositories/updating/cart-read-repository-update.handler';

@Module({
  imports: [CqrsModule],
  exports: [
    // CartReadStackTypes.CART_PRODUCTS_READ_REPOSITORY,
    // CartReadStackTypes.CART_READ_REPOSITORY,
  ],
  providers: [
    ...QueryHandlers,
    CartReadRepositoryUpdateHandler,
    {
      provide: CartReadStackTypes.CART_PRODUCTS_READ_REPOSITORY,
      useClass: InMemoryCartProductsRepository,
    },
    {
      provide: CartReadStackTypes.CART_READ_REPOSITORY,
      useClass: InMemoryCartRepository,
    },
  ],
})
export class CartReadStackModule {}
