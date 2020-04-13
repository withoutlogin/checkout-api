import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CartFinderService } from './cart-read-stack/cart-finder/cart-finder.service';
import {
  CartReadDto,
  CartProductReadDto,
} from './cart-read-stack/cart-read-dtos';

/**
 * @todo implementation based on repo
 */
@Controller('carts')
export class CartController {
  constructor(
    private commandBus: CommandBus,
    private cartFinder: CartFinderService,
  ) {}

  @Get(':cartId')
  async getCart(@Param('cartId') cartId: string): Promise<CartReadDto> {
    const result = await this.cartFinder.getCart(cartId);

    if (result) {
      return result;
    }
    throw new NotFoundException();
  }

  @Get(':cartId/products')
  async getCartProducts(
    @Param('cartId') cartId: string,
  ): Promise<CartProductReadDto[]> {
    const cart = await this.getCart(cartId);
    if (!cart) {
      throw new NotFoundException();
    }

    return this.cartFinder.getProductsFor(cart.id);
  }
}
