import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  CartProductsReadDto,
  ProductReadDto,
} from '../cart-read-stack/dto/cart-products.dto';
import { CartProductsQuery } from 'cart/cart-read-stack/queries/cart-products.query';
import { CartByIdQuery } from '../cart-read-stack/queries/cart-by-id.query';

@Controller('cart/:cartId/products')
export class CartProductController {
  constructor(private queryBus: QueryBus) {}

  @Get('/')
  async getCartProducts(
    @Param('cartId') cartId: string,
  ): Promise<ProductReadDto[]> {
    const cart = await this.queryBus.execute(new CartByIdQuery(cartId));
    if (!cart) {
      throw new NotFoundException();
    }

    const productsDto = (await this.queryBus.execute(
      new CartProductsQuery(cartId),
    )) as CartProductsReadDto;

    return productsDto.products;
  }
}
