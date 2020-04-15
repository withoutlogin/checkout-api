import { IMoneyData } from 'cart/cart-domain/valueobjects';

export class ProductReadDto {
  constructor(
    public readonly id: string,
    public name: string,
    public price: IMoneyData,
    public quantity: number,
    public description?: string,
  ) {}
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
