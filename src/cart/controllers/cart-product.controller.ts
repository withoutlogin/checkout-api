import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseInterceptors,
  Put,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiParam, ApiResponse } from '@nestjs/swagger';
import { CartProductsQuery } from 'cart/cart-read-stack/queries/cart-products.query';
import { CreatedLocationInterceptor } from 'common/rest/interceptors';
import { ResourceCreatedInCollection } from '../../common/rest/response';
import { AddProductCommand } from '../cart-domain/commands/add-product.command';
import {
  CartProductsReadDto,
  ProductReadDto,
} from '../cart-read-stack/dto/cart-products.dto';
import { CartByIdQuery } from '../cart-read-stack/queries/cart-by-id.query';
import { CartProductInputDto } from './dtos/cart-product.dto';
import { CartProductUpdateInputDto } from './dtos/cart-product-update-input.dto';
import { ProductQuantityUpdatedEvent } from '../cart-domain/events/product-quantity-updated-event';
import { ChangeProductQuantityCommand } from '../cart-domain/commands/change-product-quantity.command';

@Controller('cart/:cartId/products')
@UseInterceptors(CreatedLocationInterceptor)
export class CartProductController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Get('/')
  @ApiResponse({ type: [ProductReadDto] })
  async getProductsInCart(
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

  @Post('/')
  @ApiResponse({ type: ResourceCreatedInCollection })
  @ApiParam({ name: 'cartId', example: 'eb261ef2-da87-41c3-8005-dad1cf2d7438' })
  async addNewProductToCart(
    @Param('cartId') cartId: string,
    @Body() input: CartProductInputDto,
  ): Promise<ResourceCreatedInCollection> {
    const products = await this.getProductsInCart(cartId);

    if (products.find((p) => p.id === input.id)) {
      throw new ConflictException();
    }

    await this.commandBus.execute(
      new AddProductCommand(cartId, input.id, input.quantity),
    );

    return new ResourceCreatedInCollection(input.id);
  }

  @Get(':productId')
  @ApiResponse({ type: ProductReadDto })
  async getSingleProductInCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ): Promise<ProductReadDto> {
    const cart = await this.queryBus.execute(new CartByIdQuery(cartId));
    if (!cart) {
      throw new NotFoundException();
    }

    const productsDto = (await this.queryBus.execute(
      new CartProductsQuery(cartId),
    )) as CartProductsReadDto;

    const product = productsDto.getProduct(productId);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  @Put(':productId')
  async updateProductInCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body() productUpdateInput: CartProductUpdateInputDto,
  ): Promise<void> {
    const cart = await this.queryBus.execute(new CartByIdQuery(cartId));
    if (!cart) {
      throw new NotFoundException();
    }

    const productsDto = (await this.queryBus.execute(
      new CartProductsQuery(cartId),
    )) as CartProductsReadDto;

    const product = productsDto.getProduct(productId);
    if (!product) {
      throw new NotFoundException();
    }

    await this.commandBus.execute(
      new ChangeProductQuantityCommand(
        cartId,
        productId,
        productUpdateInput.quantity,
      ),
    );
  }
}
