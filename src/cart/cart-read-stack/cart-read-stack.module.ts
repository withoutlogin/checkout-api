import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CartReadStackTypes } from './cart-read-stack.types';
import {
  InMemoryCartProductsRepository,
  InMemoryCartRepository,
} from './infrastructure/in-memory';
import { QueryHandlers } from './queries';

@Module({
  imports: [CqrsModule],
  exports: [
    // CartReadStackTypes.CART_PRODUCTS_READ_REPOSITORY,
    // CartReadStackTypes.CART_READ_REPOSITORY,
  ],
  providers: [
    ...QueryHandlers,
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
