import { Module } from '@nestjs/common';
import { CartWriteStackModule } from './cart-write-stack/cart-write-stack.module';
import { CartController } from './cart.controller';
import { CartReadStackModule } from './cart-read-stack/cart-read-stack.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, CartWriteStackModule, CartReadStackModule],
  controllers: [CartController],
})
export class CartModule {}
