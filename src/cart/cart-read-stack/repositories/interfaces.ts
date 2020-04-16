import { CartReadDto } from '../dto/cart.dto';
import { CartProductsReadDto } from '../dto';

export interface ICartReadRepository {
  delete(cart: CartReadDto): Promise<void>;
  getById(cartId: string): Promise<CartReadDto | undefined>;
  store(data: CartReadDto): Promise<void>;
}

export interface ICartProductsReadRepository {
  delete(products: CartProductsReadDto): Promise<void>;
  getForCartId(cartId: string): Promise<CartProductsReadDto>;
  store(cartProducts: CartProductsReadDto): Promise<void>;
}
