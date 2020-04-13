import { Injectable } from '@nestjs/common';
import { Maybe } from 'common/ts-helpers';
import { CartReadDto, CartProductReadDto } from '../cart-read-dtos';

@Injectable()
export class CartFinderService {
  getProductsFor(cartId: string): Promise<CartProductReadDto[]> {
    throw new Error('Method not implemented.');
  }
  async getCart(cartId: string): Promise<Maybe<CartReadDto>> {
    throw new Error('Method not implemented.');
  }
}
