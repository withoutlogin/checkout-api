import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCartCommand } from 'cart/cart-domain/commands/create-cart.command';
import { CartReadDto } from 'cart/cart-read-stack/dto';
import { CartByIdQuery } from 'cart/cart-read-stack/queries/cart-by-id.query';
import { CreatedLocationInterceptor } from 'common/rest/interceptors';
import { ResourceCreatedInCollection } from 'common/rest/response';
import { Maybe } from 'common/ts-helpers';
import { v4 as uuidv4 } from 'uuid';
import { Currency } from '../../pricing/money';

/**
 * @todo implementation based on repo
 */
@Controller('carts')
@UseInterceptors(CreatedLocationInterceptor)
export class CartController {
  private logger = new Logger(CartController.name);

  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Post('')
  async createCart(): Promise<string | ResourceCreatedInCollection> {
    const defaultCurrency: Currency = 'USD';
    const id = uuidv4();

    const command = new CreateCartCommand(id, defaultCurrency);
    await this.commandBus.execute(command);

    return new ResourceCreatedInCollection(id);
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
