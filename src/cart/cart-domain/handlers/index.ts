import { AddProductHandler } from './add-product.handler';
import { ChangeProductQuantityHandler } from './change-product-quantity.handler';
import { CreateCartHandler } from './create-cart.handler';
import { RemoveProductHandler } from './remove-product.handler';
import { ChangeCartCurrencyHandler } from './cart-currency-changed.handler';

export const commandHandlers = [
  AddProductHandler,
  ChangeProductQuantityHandler,
  CreateCartHandler,
  RemoveProductHandler,
  ChangeCartCurrencyHandler,
];
