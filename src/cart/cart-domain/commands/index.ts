import { AddProductCommand } from './add-product.command';
import { RemoveProductCommand } from './remove-product.command';
import { ChangeProductQuantityCommand } from './change-product-quantity.command';
import { CreateCartCommand } from './create-cart.command';
import { CartCheckoutCommand } from './cart-checkout.command';
import { DeleteCartCommand } from './delete-cart-command';

export const commands = [
  AddProductCommand,
  RemoveProductCommand,
  ChangeProductQuantityCommand,
  CreateCartCommand,
  CartCheckoutCommand,
  DeleteCartCommand,
];
