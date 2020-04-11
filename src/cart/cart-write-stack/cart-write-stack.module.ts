import { Module } from '@nestjs/common';
import { CartDomainTypes } from '../cart-domain/cart-domain.types';
import { CartRepository } from './cart-repository';

@Module({
  exports: [CartDomainTypes.REPOSITORY],
  providers: [
    CartRepository,
    {
      provide: CartDomainTypes.REPOSITORY,
      useClass: CartRepository,
    },
  ],
})
export class CartWriteStackModule {}
