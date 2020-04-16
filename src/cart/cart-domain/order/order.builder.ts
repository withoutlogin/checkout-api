import { Logger } from '@nestjs/common';
import { CartProductsReadDto } from '../../cart-read-stack/dto/cart-products.dto';
import { Order } from './order';
import { OrderProduct } from './order-product';
import { Currency } from 'pricing/money';

export class OrderBuilder {
  private logger = new Logger(OrderBuilder.name);
  private id?: string;
  private products: OrderProduct[] = [];
  private currency!: Currency;

  withId(id: string): this {
    this.id = id;
    return this;
  }

  withCurrency(cartCurrency: Currency): this {
    this.currency = cartCurrency;
    return this;
  }

  withProducts(productsDto: CartProductsReadDto): this {
    this.products = productsDto
      .getProducts()
      .map((p) => new OrderProduct(p.id, p.quantity, p.price, p.name));

    return this;
  }

  build(): Order | null {
    if (!this.id || !this.products?.length || !this.currency) {
      this.logger.error(
        `Unable to create order with id ${
          this.id
        } and with products ${JSON.stringify(this.products)}.`,
      );
      return null;
    }

    return new Order(this.id, this.currency, this.products);
  }
}
