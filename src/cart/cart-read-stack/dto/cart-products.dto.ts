import { IMoneyData } from 'cart/cart-domain/valueobjects';

export class ProductReadDto {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: IMoneyData,
    public readonly quantity: number,
    public readonly description?: string,
  ) {}
}

export class CartProductsReadDto {
  constructor(
    public readonly cartId: string,
    public readonly products: ProductReadDto[],
  ) {}
}
