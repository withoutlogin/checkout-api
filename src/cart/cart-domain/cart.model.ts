import { AggregateRoot } from '@nestjs/cqrs';
import { CartProduct } from './cart-product.model';
import { ProductAddedEvent } from './events/product-added-event';
import { CartCurrencyChangedEvent } from './events/cart-currency-changed-event';
import { CartCurrency } from './cart-currency.model';
import { CartCurrencyConversionRateChangedEvent } from './events/cart-currency-conversion-rate-changed-event';
import { ProductQuantityUpdatedEvent } from './events/product-quantity-updated-event';

export class Cart extends AggregateRoot {
  constructor(
    private id: string,
    private currency: CartCurrency,
    private products: CartProduct[],
  ) {
    super();
  }

  async addProduct(product: CartProduct): Promise<void> {
    const existing = this.getProduct(product.id);
    if (existing) {
      return this.changeProductQuantity(
        new CartProduct(
          product.id,
          existing.quantity + product.quantity, // todo: decide if pass the increment logic to the repository to solve potential write race condition
          existing.price,
        ),
      );
    }

    this.apply(new ProductAddedEvent(this.id, product));
  }

  async changeProductQuantity(
    productWithDesiredQuantity: CartProduct,
  ): Promise<void> {
    if (!this.hasProduct(productWithDesiredQuantity.id)) {
      throw new Error('Product not found');
    }
    this.apply(
      new ProductQuantityUpdatedEvent(
        this.id,
        productWithDesiredQuantity.id,
        productWithDesiredQuantity.quantity,
      ),
    );
  }

  getProduct(productId: string): CartProduct | undefined {
    return this.products.find((product) => product.id === productId);
  }
  private hasProduct(productId: string): boolean {
    return this.products.findIndex((product) => product.id === productId) > -1;
  }

  async changeCurrency(newCurrency: CartCurrency): Promise<void> {
    if (newCurrency.currency === this.currency.currency) {
      return;
    }

    this.apply(new CartCurrencyChangedEvent(this.id, newCurrency));

    this.currency = newCurrency;
  }

  async updateCartCurrencyConversionRate(newCurrency: CartCurrency) {
    if (newCurrency.currency !== this.currency.currency) {
      throw new Error(
        'Method should be used to update conversion rate. To change currency use Cart.changeCurrency method.',
      );
    }

    this.apply(
      new CartCurrencyConversionRateChangedEvent(this.id, newCurrency),
    );

    this.currency = newCurrency;
  }
}
