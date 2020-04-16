import { ICartProductsReadRepository } from '../interfaces';
import { CartProductsReadDto } from 'cart/cart-read-stack/dto';

export class InMemoryCartProductsRepository
  implements ICartProductsReadRepository {
  private storage = new Map<string, CartProductsReadDto>();

  async getForCartId(cartId: string): Promise<CartProductsReadDto> {
    const dto = this.storage.get(cartId);
    if (!dto) {
      return this.createNewDto(cartId);
    }
    return dto;
  }
  createNewDto(cartId: string): CartProductsReadDto {
    return new CartProductsReadDto(cartId);
  }
  async store(cartProducts: CartProductsReadDto): Promise<void> {
    this.storage.set(cartProducts.cartId, cartProducts);
  }
  async delete(products: CartProductsReadDto): Promise<void> {
    this.storage.delete(products.cartId);
  }
}
