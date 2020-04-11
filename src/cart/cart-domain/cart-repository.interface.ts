import { Cart } from './cart.model';

export interface ICartRepository {
  load(cartId: string): Promise<Cart>;
}
