import { Module } from '@nestjs/common';
import { CartDomainTypes } from '../cart-domain/cart-domain.types';
import { CartRepository } from './cart-repository';

@Module({
  exports: [CartDomainTypes.CART_REPOSITORY],
  providers: [
    CartRepository,
    {
      provide: CartDomainTypes.CART_REPOSITORY,
      useClass: CartRepository,
    },
  ],
})
export class CartWriteStackModule {}
