import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCartCommand } from 'cart/cart-domain/commands/create-cart.command';
import { CartReadDto } from 'cart/cart-read-stack/dto';
import { CartByIdQuery } from 'cart/cart-read-stack/queries/cart-by-id.query';
import { Maybe } from 'common/ts-helpers';
import { v4 as uuidv4 } from 'uuid';
import { Currency } from '../../pricing/money';
import { CreateCartHandler } from '../cart-domain/handlers/create-cart.handler';

/**
 * @todo implementation based on repo
 */
@Controller('carts')
export class CartController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Post('')
  async createCart(): Promise<CartReadDto> {
    const defaultCurrency: Currency = 'USD';
    const id = uuidv4();

    const command = new CreateCartCommand(id, defaultCurrency);
    await this.commandBus.execute(command);

    return (await this.queryBus.execute(new CartByIdQuery(id))) as CartReadDto;
  }

  @Get(':cartId')
  async getCart(@Param('cartId') cartId: string): Promise<CartReadDto> {
    const result = (await this.queryBus.execute(
      new CartByIdQuery(cartId),
    )) as Maybe<CartReadDto>;

    if (result) {
      return result;
    }

    throw new NotFoundException();
  }

  // @Get(':cartId/products')
  // async getCartProducts(
  //   @Param('cartId') cartId: string,
  // ): Promise<CartProductReadDto[]> {
  //   const cart = await this.getCart(cartId);
  //   if (!cart) {
  //     throw new NotFoundException();
  //   }

  //   return this.cartFinder.getProductsFor(cart.id);
  // }
}
