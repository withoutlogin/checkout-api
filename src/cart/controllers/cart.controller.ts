import {
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
  Put,
  Body,
  HttpCode,
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
import { ApiResponse, ApiParam, ApiOperation } from '@nestjs/swagger';
import { CartCurrencyChangeInputDto } from './dtos/cart-currency-change-input.dto';
import { ChangeCartCurrencyCommand } from '../cart-domain/commands/change-cart-currency.command';

/**
 * @todo implementation based on repo
 */
@Controller('carts')
@UseInterceptors(CreatedLocationInterceptor)
export class CartController {
  private logger = new Logger(CartController.name);

  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Post('')
  @ApiOperation({
    description: 'Allows to create new cart.',
  })
  @ApiResponse({
    type: ResourceCreatedInCollection,
    status: 201,
    description: 'New cart created',
  })
  async createCart(): Promise<ResourceCreatedInCollection> {
    const defaultCurrency: Currency = 'USD';
    const id = uuidv4();

    const command = new CreateCartCommand(id, defaultCurrency);
    await this.commandBus.execute(command);

    return new ResourceCreatedInCollection(id);
  }

  @Get(':cartId')
  @ApiOperation({
    description: 'Returns cart definition.',
  })
  @ApiParam({ name: 'cartId', example: 'eb261ef2-da87-41c3-8005-dad1cf2d7438' })
  @ApiResponse({ type: CartReadDto })
  async getCart(@Param('cartId') cartId: string): Promise<CartReadDto> {
    const result = (await this.queryBus.execute(
      new CartByIdQuery(cartId),
    )) as Maybe<CartReadDto>;

    if (result) {
      return result;
    }

    throw new NotFoundException();
  }

  @Put(':cartId')
  @HttpCode(204)
  @ApiOperation({
    description: 'Allows to change currency the cart is operating in.',
  })
  @ApiParam({ name: 'cartId', example: 'eb261ef2-da87-41c3-8005-dad1cf2d7438' })
  async changeCartCurrency(
    @Param('cartId') cartId: string,
    @Body() input: CartCurrencyChangeInputDto,
  ): Promise<void> {
    const result = (await this.queryBus.execute(
      new CartByIdQuery(cartId),
    )) as Maybe<CartReadDto>;

    if (!result) {
      throw new NotFoundException();
    }

    this.commandBus.execute(
      new ChangeCartCurrencyCommand(cartId, input.currency),
    );
  }
}
