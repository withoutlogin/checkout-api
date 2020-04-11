import { Module } from '@nestjs/common';
import { CartDomainModule } from './cart-domain/cart-domain.module';
import { CartDomainTypes } from './cart-domain/cart-domain.types';
import { CartWriteStackModule } from './cart-write-stack/cart-write-stack.module';
import { CartRepository } from './cart-write-stack/cart-repository';

@Module({
  imports: [CartWriteStackModule, CartDomainModule],
})
export class CartModule {}
