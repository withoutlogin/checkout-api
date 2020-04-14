import { CartReadDto } from '../dto/cart.dto';
import { CartProductsReadDto } from '../dto';

export interface ICartReadRepository {
  getById(cartId: string): Promise<CartReadDto | undefined>;
  store(data: CartReadDto): Promise<void>;
}

export interface ICartProductsReadRepository {
  getForCartId(cartId: string): Promise<CartProductsReadDto | undefined>;
  store(cartProducts: CartProductsReadDto): Promise<void>;
}
