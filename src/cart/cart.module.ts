import { Module } from '@nestjs/common';
import { CartController } from './controllers/cart.controller';
import { CartReadStackModule } from './cart-read-stack/cart-read-stack.module';
import { CqrsModule } from '@nestjs/cqrs';

import { CartWriteStackModule } from './cart-write-stack/cart-write-stack.module';
import { CartProductController } from './controllers/cart-product.controller';
import { CartDomainModule } from './cart-domain/cart-domain.module';

@Module({
  imports: [
    CqrsModule,
    CartDomainModule,
    CartWriteStackModule,
    CartReadStackModule,
  ],
  controllers: [CartController, CartProductController],
  providers: [],
})
export class CartModule {}
