import { IEventHandler, EventsHandler, EventBus } from '@nestjs/cqrs';
import { ESEvent } from 'common/event-sourcing';
import { domainEvents } from 'cart/cart-domain/events';
import { Inject, Logger } from '@nestjs/common';
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

@EventsHandler(...domainEvents)
export class CartReadRepositoryUpdateHandler implements IEventHandler<ESEvent> {
  logger = new Logger(CartReadRepositoryUpdateHandler.name);

  constructor(
    @Inject(CartReadStackTypes.CART_READ_REPOSITORY)
    private repo: ICartReadRepository,
    @Inject(CartReadStackTypes.CART_PRODUCTS_READ_REPOSITORY)
    private productsRepo: ICartProductsReadRepository,
    private eventBus: EventBus,
  ) {}

  handle(event: ESEvent) {
    this.logger.debug(
      `Received ${event.getEventName()} with payload ${JSON.stringify(event)}`,
    );

    if (event.getSubjectName() === Cart.name) {
      const cartId = event.getSubjectIdentifier();
      const promises: Promise<void>[] = [];

      if (event instanceof CartCreatedEvent) {
        promises.push(
          this.repo.store(
            new CartReadDto(
              event.cartId,
              event.cartCurrencyName,
              event.cartCurrencyConversionRate,
            ),
          ),
        );
      }
      if (event instanceof ProductAddedEvent) {
        promises.push(
          (async (): Promise<void> => {
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
          })(),
        );
      }

      if (event instanceof ProductRemovedEvent) {
        promises.push(
          (async (): Promise<void> => {
            const cartProducts = await this.productsRepo.getForCartId(cartId);
            await this.productsRepo.store(
              cartProducts.withRemovedProduct(event.productId),
            );
          })(),
        );
      }
      if (event instanceof ProductQuantityUpdatedEvent) {
        promises.push(
          (async (): Promise<void> => {
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
          })(),
        );
      }

      if (event instanceof ProductPriceUpdatedEvent) {
        promises.push(
          (async (): Promise<void> => {
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
          })(),
        );
      }

      if (event instanceof CartCurrencyConversionRateChangedEvent) {
        // todo:
        // 1. execute Query for prices in this cart
        // 2. receive calculated cart
        // 3. store new summary and product prices.
      }

      if (promises.length) {
        Promise.all(promises).then(() => {
          this.eventBus.publish(new CartReadModelUpdatedEvent(cartId));
        });
      }
    }
  }
}
