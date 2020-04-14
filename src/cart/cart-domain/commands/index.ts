import { AddProductCommand } from './add-product.command';
import { RemoveProductCommand } from './remove-product.command';
import { ChangeProductQuantityCommand } from './change-product-quantity.command';

export const commands = [
  AddProductCommand,
  RemoveProductCommand,
  ChangeProductQuantityCommand,
];
