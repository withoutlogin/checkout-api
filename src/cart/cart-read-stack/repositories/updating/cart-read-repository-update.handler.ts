import { IEventHandler, EventsHandler, EventBus, ofType } from '@nestjs/cqrs';
import { ESEvent } from 'common/event-sourcing';
import { domainEvents } from 'cart/cart-domain/events';
import { Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import { CartReadStackTypes } from 'cart/cart-read-stack/cart-read-stack.types';
import {
  ICartReadRepository,
  ICartProductsReadRepository,
} from '../interfaces';
import { Cart } from 'cart/cart-domain/cart';
import { CartCreatedEvent } from 'cart/cart-domain/events/cart-created-event';
import { CartReadDto, ProductReadDto } from 'cart/cart-read-stack/dto';
import { ProductAddedEvent } from '../../../cart-domain/events/product-added-event';
import { CartReadModelUpdatedEvent } from 'cart/cart-read-stack/events/cart-read-model-updated.event';
import { ProductQuantityUpdatedEvent } from '../../../cart-domain/events/product-quantity-updated-event';
import { DataCorruptedError } from '../../../cart-write-stack/cart-repository/errors';
import { ProductPriceUpdatedEvent } from 'cart/cart-domain/events/product-price-updated-event';
import { ProductRemovedEvent } from 'cart/cart-domain/events/product-removed-event';
import { CartCurrencyConversionRateChangedEvent } from 'cart/cart-domain/events/cart-currency-conversion-rate-changed-event';
import { Subject, Subscription } from 'rxjs';
import { sequentialQueueOfAsync } from 'common/rxjs/custom-operators';

@EventsHandler(...domainEvents)
export class CartReadRepositoryUpdateHandler
  implements IEventHandler<ESEvent>, OnModuleDestroy {
  private logger = new Logger(CartReadRepositoryUpdateHandler.name);
  private queue$: Subject<ESEvent>;
  private subscription: Subscription;

  constructor(
    @Inject(CartReadStackTypes.CART_READ_REPOSITORY)
    private repo: ICartReadRepository,
    @Inject(CartReadStackTypes.CART_PRODUCTS_READ_REPOSITORY)
    private productsRepo: ICartProductsReadRepository,
    private eventBus: EventBus,
  ) {
    this.queue$ = new Subject<ESEvent>();

    this.subscription = this.queue$
      .pipe(sequentialQueueOfAsync(this.handleCartEvent.bind(this)))
      .subscribe();
  }
  onModuleDestroy() {
    this.subscription.unsubscribe();
  }

  addToProcessingQueue(event: ESEvent) {
    this.queue$.next(event);
  }

  async handleCartEvent(event: ESEvent): Promise<void> {
    await this.process(event);
  }

  handle(event: ESEvent) {
    this.logger.debug(
      `Received ${event.getEventName()} with payload ${JSON.stringify(event)}`,
    );
    this.addToProcessingQueue(event);
  }

  async process(event: ESEvent): Promise<void> {
    if (event.getSubjectName() === Cart.name) {
      const cartId = event.getSubjectIdentifier();

      if (event instanceof CartCreatedEvent) {
        await this.repo.store(
          new CartReadDto(
            event.cartId,
            event.cartCurrencyName,
            event.cartCurrencyConversionRate,
          ),
        );
      }
      if (event instanceof ProductAddedEvent) {
        const cartProducts = await this.productsRepo.getForCartId(cartId);
        await this.productsRepo.store(
          cartProducts.withAddedProduct(
            new ProductReadDto(
              event.productId,
              'Some name obtained from PIM',
              event.productPrice,
              event.quantity,
              'Some description obtained from PIM',
            ),
          ),
        );
      }

      if (event instanceof ProductRemovedEvent) {
        const cartProducts = await this.productsRepo.getForCartId(cartId);
        await this.productsRepo.store(
          cartProducts.withRemovedProduct(event.productId),
        );
      }

      if (event instanceof ProductQuantityUpdatedEvent) {
        const cartProducts = await this.productsRepo.getForCartId(cartId);
        const product = cartProducts.getProduct(event.productId);
        if (!product) {
          throw new DataCorruptedError(
            'Cart read model does not contain product which quantity is being modified. Cannot handle ProductQuantityUpdatedEvent.',
          );
        }

        await this.productsRepo.store(
          cartProducts.withChangedProduct(
            new ProductReadDto(
              event.productId,
              product.name,
              product.price,
              event.newQuantity,
              product.description,
            ),
          ),
        );
      }

      if (event instanceof ProductPriceUpdatedEvent) {
        const cartProducts = await this.productsRepo.getForCartId(cartId);
        const product = cartProducts.getProduct(event.productId);
        if (!product) {
          throw new DataCorruptedError(
            'Cart read model does not contain product which quantity is being modified. Cannot handle ProductQuantityUpdatedEvent.',
          );
        }

        await this.productsRepo.store(
          cartProducts.withChangedProduct(
            new ProductReadDto(
              event.productId,
              product.name,
              event.newPrice,
              product.quantity,
              product.description,
            ),
          ),
        );
      }

      if (event instanceof CartCurrencyConversionRateChangedEvent) {
        // todo:
        // 1. execute Query for prices in this cart
        // 2. receive calculated cart
        // 3. store new summary and product prices.
      }

      this.eventBus.publish(new CartReadModelUpdatedEvent(cartId));
    }
  }
}
