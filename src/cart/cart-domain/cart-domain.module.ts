import { Module } from '@nestjs/common';
import { Cart } from './cart.model';
import { AddProductCommand } from './commands/add-product-command';
import { RemoveProductCommand } from './commands/remove-product-command';
import { ChangeProductQuantityCommand } from './commands/change-product-quantity-command';
import { AddProductHandler } from './handlers/add-product-handler';
import { RemoveProductHandler } from './handlers/remove-product-handler';
import { ChangeProductQuantityHandler } from './handlers/change-product-quantity-handler';

const commands = [
  AddProductCommand,
  RemoveProductCommand,
  ChangeProductQuantityCommand,
];

const handlers = [
  AddProductHandler,
  RemoveProductHandler,
  ChangeProductQuantityHandler,
];

@Module({
  providers: [...commands, ...handlers, Cart],
  exports: [...commands, ...handlers, Cart],
})
export class CartDomainModule {}
