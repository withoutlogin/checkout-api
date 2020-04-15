import { CartReadDto } from 'cart/cart-read-stack/dto';
import { ICartReadRepository } from '../interfaces';

export class InMemoryCartRepository implements ICartReadRepository {
  private storage = new Map<string, CartReadDto>();

  async getById(cartId: string): Promise<CartReadDto | undefined> {
    return this.storage.get(cartId);
  }
  async store(data: CartReadDto): Promise<void> {
    this.storage.set(data.cartId, data);
  }
}
