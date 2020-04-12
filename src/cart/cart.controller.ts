import { Controller, Get, Param, Inject } from '@nestjs/common';
import { CartReadDto } from './cart-read-stack/cart-read-dto';

/**
 * @todo implementation based on repo
 */
@Controller('carts')
export class CartController {
  @Get(':cartId')
  async getCart(@Param('cartId') cartId: string): Promise<CartReadDto> {
    return {
      id: cartId,
      currency: 'EUR',
    };
  }
}
