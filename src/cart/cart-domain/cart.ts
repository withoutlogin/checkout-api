import { AggregateRoot } from '@nestjs/cqrs';
import { DomainError } from 'common/ddd/errors';
import { Currency } from 'pricing/money';
import { DomainEntity } from '../../common/ddd/interfaces';
import {
  CannotCheckoutEmptyCart,
  ForbiddenDomainActionError,
  ProductNotFoundInCart,
} from './errors';
import { CartCheckedOutEvent } from './events/cart-checked-out-event';
import { CartCreatedEvent } from './events/cart-created-event';
import { CartCurrencyChangedEvent } from './events/cart-currency-changed-event';
import { ProductAddedEvent } from './events/product-added-event';
import { ProductRemovedEvent } from './events/product-removed-event';
import { CartProduct } from './valueobjects/cart-product';

export class Cart extends AggregateRoot implements DomainEntity {
  private _id!: string;
  private currency!: Currency;
  private products = new Map<string, CartProduct>();
  private isCheckedOut = false;

  public get id(): string {
    if (!this._id) {
      throw new DomainError('Cart not initialized.');
    }
    return this._id;
  }
  constructor() {
    super();
  }

  initialize(id: string, currency: Currency) {
    if (this._id) {
      throw new DomainError('Can be initialized only once.');
    }
    this.apply(new CartCreatedEvent(id, currency));
  }

  onCartCreatedEvent(event: CartCreatedEvent) {
    this._id = event.cartId;
    this.currency = event.cartCurrency;
  }

  addProduct(product: CartProduct): void {
    if (this.isCheckedOut) {
      throw new ForbiddenDomainActionError();
    }

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

  changeCurrency(
    newCurrency: Currency,
    recalculatedProducts: CartProduct[],
  ): void {
    if (this.isCheckedOut) {
      throw new ForbiddenDomainActionError();
    }
    if (newCurrency === this.currency) {
      return;
    }

    this.apply(
      new CartCurrencyChangedEvent(this.id, newCurrency, recalculatedProducts),
    );
  }

  onCartCurrencyChangedEvent(event: CartCurrencyChangedEvent): void {
    this.currency = event.newCurrency;
    event.recalculatedCartProducts.forEach((product) => {
      this.products.set(product.productId, product);
    });
  }

  removeProduct(productId: string) {
    if (this.isCheckedOut) {
      throw new ForbiddenDomainActionError();
    }
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
    if (this.isCheckedOut) {
      throw new ForbiddenDomainActionError();
    }
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

  getProducts(): CartProduct[] {
    return Array.from(this.products.values());
  }

  markAsCheckedOut(): void {
    if (this.isCheckedOut) {
      return;
    }
    if (this.isEmpty()) {
      throw new CannotCheckoutEmptyCart();
    }
    this.apply(new CartCheckedOutEvent(this.id));
  }

  onCartCheckedOutEvent(_event: CartCheckedOutEvent): void {
    this.isCheckedOut = true;
  }

  isEmpty(): boolean {
    return this.products.size === 0;
  }

  onCartDeletedEvent(): void {
    this.isCheckedOut = true;
  }

  getCurrency(): Currency {
    if (!this.currency) {
      throw new DomainError('Cart is not initialized and committed.');
    }
    return this.currency;
  }
  canBeCheckedOut(): boolean {
    return !this.isEmpty();
  }
}
