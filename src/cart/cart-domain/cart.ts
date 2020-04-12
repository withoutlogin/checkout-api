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
    private id: string,
    private currency: CartCurrency,
    private products: Map<string, CartProduct>,
  ) {
    super();
  }

  addProduct(product: CartProduct): void {
    const existing = this.getProduct(product.productId);
    if (existing) {
      this.changeProductQuantity(
        product.productId,
        existing.quantity + product.quantity, // todo: decide if pass the increment logic to the repository to solve potential write race condition
      );
    } else {
      this.apply(new ProductAddedEvent(this.id, product));
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

    this.currency = newCurrency;
  }

  removeProduct(productId: string) {
    if (this.getProduct(productId)) {
      this.apply(new ProductRemovedEvent(this.id, productId));
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

    if (newQuantity === product.quantity) {
      return;
    }
    this.apply(
      new ProductQuantityUpdatedEvent(this.id, productId, newQuantity),
    );
  }

  getProduct(productId: string): CartProduct | undefined {
    return this.products.get(productId);
  }

  getCurrency(): CartCurrency {
    return this.currency;
  }

  changeCurrency(newCurrency: CartCurrency): void {
    if (newCurrency.currency === this.currency.currency) {
      return;
    }

    this.apply(new CartCurrencyChangedEvent(this.id, newCurrency));
    this.currency = newCurrency;
  }

  apply(event: IEvent, isFromHistory?: boolean) {
    console.debug('Cart apply', event, isFromHistory);
  }
}
