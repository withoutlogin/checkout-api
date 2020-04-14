import { CartProductsReadDto } from '../../dto/cart-products.dto';
import {
  ICartReadRepository,
  ICartProductsReadRepository,
} from 'cart/cart-read-stack/repositories/interfaces';
import { CartReadDto } from 'cart/cart-read-stack/dto';

export class InMemoryCartRepository implements ICartReadRepository {
  private storage = new Map<string, CartReadDto>();

  async getById(cartId: string): Promise<CartReadDto | undefined> {
    return this.storage.get(cartId);
  }
  async store(data: CartReadDto): Promise<void> {
    this.storage.set(data.cartId, data);
  }
}

export class InMemoryCartProductsRepository
  implements ICartProductsReadRepository {
  private storage = new Map<string, CartProductsReadDto>();

  async getForCartId(cartId: string): Promise<CartProductsReadDto | undefined> {
    return this.storage.get(cartId);
  }
  async store(cartProducts: CartProductsReadDto): Promise<void> {
    this.storage.set(cartProducts.cartId, cartProducts);
  }
}
