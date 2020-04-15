import { IMoneyData } from 'cart/cart-domain/valueobjects';
import { ApiProperty } from '@nestjs/swagger';
import { Currency } from 'pricing/money';

export class IMoneyDataDto implements IMoneyData {
  @ApiProperty({ example: 780 })
  amount!: number;
  @ApiProperty({ example: 2 })
  precision!: number;
  @ApiProperty({
    type: String,
    description: 'Currency code',
    example: 'USD',
    examples: ['USD', 'EUR', 'PLN'],
  })
  currency!: Currency;
}

export class ProductReadDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: IMoneyDataDto })
  price: IMoneyData;
  @ApiProperty()
  quantity: number;
  @ApiProperty({ type: String, required: false })
  description?: string;

  constructor(
    id: string,
    name: string,
    price: IMoneyData,
    quantity: number,
    description?: string,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = quantity;
    this.description = description;
  }
}

export class CartProductsReadDto {
  constructor(
    public readonly cartId: string,
    public readonly products: ProductReadDto[] = [],
  ) {}

  getProduct(productId: string): ProductReadDto | undefined {
    return this.products.find((p) => p.id === productId);
  }
  getProducts(): ProductReadDto[] {
    return this.products;
  }
  withAddedProduct(product: ProductReadDto): CartProductsReadDto {
    const existing = this.getProduct(product.id);
    if (existing) {
      return this.withChangedProduct(
        new ProductReadDto(
          existing.id,
          existing.name,
          existing.price,
          existing.quantity + product.quantity,
          existing.description,
        ),
      );
    }
    return new CartProductsReadDto(this.cartId, [...this.products, product]);
  }

  withRemovedProduct(productId: string): CartProductsReadDto {
    return new CartProductsReadDto(
      this.cartId,
      this.products.filter((p) => p.id !== productId),
    );
  }

  withChangedProduct(product: ProductReadDto): CartProductsReadDto {
    const idx = this.products.findIndex((p) => p.id === product.id);
    const products = this.products.slice();
    if (idx > -1) {
      products[idx] = product;
    }
    return new CartProductsReadDto(this.cartId, products);
  }
}
