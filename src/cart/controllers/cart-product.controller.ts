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
  Delete,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiParam, ApiResponse, ApiOperation } from '@nestjs/swagger';
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
import { ChangeProductQuantityCommand } from '../cart-domain/commands/change-product-quantity.command';
import { RemoveProductCommand } from '../cart-domain/commands/remove-product.command';

@Controller('cart/:cartId/products')
@UseInterceptors(CreatedLocationInterceptor)
export class CartProductController {
  constructor(private queryBus: QueryBus, private commandBus: CommandBus) {}

  @Get('/')
  @ApiResponse({ status: 200, type: [ProductReadDto] })
  @ApiParam({ name: 'cartId', example: 'eb261ef2-da87-41c3-8005-dad1cf2d7438' })
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
  @ApiOperation({
    description: 'Adds new product to cart.',
  })
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
  @ApiOperation({
    description: 'Returns current state of product in the cart.',
  })
  @ApiParam({
    name: 'productId',
    example: '2680ee73-8661-4248-a1a0-b77799fc8cb4',
  })
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
  @ApiOperation({
    description: `Allows to update product's quantity.`,
  })
  @HttpCode(204)
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  @ApiResponse({ status: 204, description: 'Updated successfully.' })
  @ApiParam({ name: 'cartId', example: 'eb261ef2-da87-41c3-8005-dad1cf2d7438' })
  @ApiParam({
    name: 'productId',
    example: '2680ee73-8661-4248-a1a0-b77799fc8cb4',
  })
  async updateProductInCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
    @Body() productUpdateInput: CartProductUpdateInputDto,
  ): Promise<void> {
    if (productUpdateInput.quantity <= 0) {
      throw new BadRequestException(null, 'Quantity cannot be negative');
    }

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

  @Delete(':productId')
  @ApiOperation({
    description: 'Deletes product from the cart.',
  })
  @HttpCode(204)
  @ApiParam({ name: 'cartId', example: 'eb261ef2-da87-41c3-8005-dad1cf2d7438' })
  @ApiParam({
    name: 'productId',
    example: '2680ee73-8661-4248-a1a0-b77799fc8cb4',
  })
  @ApiResponse({ status: 404, description: 'Resource not found.' })
  @ApiResponse({ status: 204, description: 'Deleted successfully.' })
  async deleteProductFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
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

    await this.commandBus.execute(new RemoveProductCommand(cartId, productId));
  }
}
