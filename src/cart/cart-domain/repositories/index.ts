import { Cart } from '../cart';
import { Money } from 'pricing/money';
import { CartCurrency } from '../valueobjects';

export interface ICartRepository {
  load(cartId: string): Promise<Cart>;
}

export interface IPricingRepository {
  getProductPrice(productId: string): Promise<Money>;
}
