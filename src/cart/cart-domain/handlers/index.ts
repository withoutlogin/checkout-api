import { AddProductHandler } from './add-product.handler';
import { ChangeProductQuantityHandler } from './change-product-quantity.handler';
import { CreateCartHandler } from './create-cart.handler';
import { RemoveProductHandler } from './remove-product.handler';

export const commandHandlers = [
  AddProductHandler,
  ChangeProductQuantityHandler,
  CreateCartHandler,
  RemoveProductHandler,
];
