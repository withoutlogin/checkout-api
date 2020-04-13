import { AggregateRoot, IEvent } from '@nestjs/cqrs';
import { DomainEntity } from '../../common/ddd/interfaces';
import { ProductNotFoundInCart } from './errors';
import { CartCurrencyChangedEvent } from './events/cart-currency-changed-event';
import { CartCurrencyConversionRateChangedEvent } from './events/cart-currency-conversion-rate-changed-event';
import { ProductAddedEvent } from './events/product-added-event';
import { ProductQuantityUpdatedEvent } from './events/product-quantity-updated-event';
import { ProductRemovedEvent } from './events/product-removed-event';
import { CartCurrency } from './valueobjects/cart-currency';
import { CartProduct } from './valueobjects/cart-product';

export class Cart extends AggregateRoot implements DomainEntity {
  constructor(
    public readonly id: string,
    private currency: CartCurrency,
    private products: Map<string, CartProduct>,
  ) {
    super();
  }

  addProduct(product: CartProduct): void {
    this.apply(
      new ProductAddedEvent(
        this.id,
        product.productId,
        product.quantity,
        product.price.toObject(),
      ),
    );
  }

  onProductAddedEvent(event: ProductAddedEvent): void {
    const current = this.products.get(event.productId);
    if (current) {
      this.products.set(event.productId, current.withAdded(event.quantity));
    } else {
      this.products.set(event.productId, event.getCartProduct());
    }
  }

  updateCartCurrencyConversionRate(newCurrency: CartCurrency) {
    if (newCurrency.currency !== this.currency.currency) {
      throw new Error(
        'Method should be used to update conversion rate. To change currency use Cart.changeCurrency method.',
      );
    }

    this.apply(
      new CartCurrencyConversionRateChangedEvent(this.id, newCurrency),
    );
  }

  onCartCurrencyConversionRateChangedEvent(
    event: CartCurrencyConversionRateChangedEvent,
  ) {
    this.currency = event.newCurrency;
    // todo: recalculate products
  }

  changeCurrency(newCurrency: CartCurrency): void {
    if (newCurrency.currency === this.currency.currency) {
      return;
    }

    this.apply(new CartCurrencyChangedEvent(this.id, newCurrency));
  }

  onCartCurrencyChangedEvent(event: CartCurrencyChangedEvent): void {
    this.currency = event.newCurrency;
    // todo: recalculate products
  }

  removeProduct(productId: string) {
    const current = this.getProduct(productId);
    if (current) {
      this.apply(new ProductRemovedEvent(this.id, productId, current.quantity));
    }
  }

  onProductRemovedEvent(event: ProductRemovedEvent): void {
    const current = this.getProduct(event.productId);
    if (current) {
      if (event.removedQuantity === current.quantity) {
        this.products.delete(event.productId);
      } else {
        this.products.set(
          event.productId,
          current.withSubtracted(event.removedQuantity),
        );
      }
    }
  }
  /**
   * @param productId
   * @param newQuantity
   */
  changeProductQuantity(productId: string, newQuantity: number): void {
    const product = this.getProduct(productId);
    if (!product) {
      throw new ProductNotFoundInCart(productId);
    }

    const diff = newQuantity - product.quantity;
    if (diff > 0) {
      this.apply(
        new ProductAddedEvent(
          this.id,
          productId,
          diff,
          product.price.toObject(),
        ),
      );
    } else if (diff < 0) {
      this.apply(new ProductRemovedEvent(this.id, productId, Math.abs(diff)));
    }
  }

  getProduct(productId: string): CartProduct | undefined {
    return this.products.get(productId);
  }

  getCurrency(): CartCurrency {
    return this.currency;
  }
}
