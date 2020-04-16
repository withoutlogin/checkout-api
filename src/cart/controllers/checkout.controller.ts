import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiResponse } from '@nestjs/swagger';
import { Cart } from 'cart/cart-domain/cart';
import { CartCheckoutCommand } from 'cart/cart-domain/commands/cart-checkout.command';
import { CartNotFound } from 'cart/cart-domain/errors';
import { CreatedLocationInterceptor } from 'common/rest/interceptors';
import { ResourceCreatedWithLocation } from 'common/rest/response';
import { Maybe } from 'common/ts-helpers';
import { v4 as uuidv4 } from 'uuid';
import { CartByIdQuery } from '../cart-read-stack/queries/cart-by-id.query';
import { CheckoutInputDto } from './dtos/checkout-input.dto';

@Controller('checkout')
@UseInterceptors(CreatedLocationInterceptor)
@ApiResponse({
  status: 400,
  description: 'If invalid request body or Cart with given id does not exist.',
})
export class CheckoutController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Post()
  @ApiResponse({
    status: 400,
    description: 'Returned when unknown cartId given.',
  })
  @ApiResponse({ status: 201, type: ResourceCreatedWithLocation })
  async processCheckout(
    @Body() checkoutInput: CheckoutInputDto,
  ): Promise<ResourceCreatedWithLocation> {
    const cart = (await this.queryBus.execute(
      new CartByIdQuery(checkoutInput.cartId),
    )) as Maybe<Cart>;

    if (!cart) {
      throw new BadRequestException();
    }

    const orderId = uuidv4();

    try {
      await this.commandBus.execute(
        new CartCheckoutCommand(checkoutInput.cartId, orderId),
      );
    } catch (e) {
      if (e instanceof CartNotFound) {
        throw new BadRequestException();
      }
    }

    return new ResourceCreatedWithLocation(`/orders/${orderId}`);
  }
}
