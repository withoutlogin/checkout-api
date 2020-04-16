import { Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import { EventBus, EventsHandler, IEventHandler, QueryBus } from '@nestjs/cqrs';
import { Cart } from 'cart/cart-domain/cart';
import { domainEvents } from 'cart/cart-domain/events';
import { CartCreatedEvent } from 'cart/cart-domain/events/cart-created-event';
import { ProductPriceUpdatedEvent } from 'cart/cart-domain/events/product-price-updated-event';
import { ProductRemovedEvent } from 'cart/cart-domain/events/product-removed-event';
import { CartReadStackTypes } from 'cart/cart-read-stack/cart-read-stack.types';
import {
  CartProductsReadDto,
  CartReadDto,
  ProductReadDto,
} from 'cart/cart-read-stack/dto';
import { CartReadModelUpdatedEvent } from 'cart/cart-read-stack/events/cart-read-model-updated.event';
import { ESEvent } from 'common/event-sourcing';
import { sequentialQueueOfAsync } from 'common/rxjs/custom-operators';
import { Maybe } from 'common/ts-helpers';
import { ProductDataDto } from 'pricing/products/dto/product-data.dto';
import { Subject, Subscription } from 'rxjs';
import { ProductDataQuery } from '../../../../pricing/products/product-data.query';
import { CartCheckedOutEvent } from '../../../cart-domain/events/cart-checked-out-event';
import { CartCurrencyChangedEvent } from '../../../cart-domain/events/cart-currency-changed-event';
import { ProductAddedEvent } from '../../../cart-domain/events/product-added-event';
import { ProductQuantityUpdatedEvent } from '../../../cart-domain/events/product-quantity-updated-event';
import { DataCorruptedError } from '../../../cart-write-stack/cart-repository/errors';
import {
  ICartProductsReadRepository,
  ICartReadRepository,
} from '../interfaces';

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
    private queryBus: QueryBus,
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
          new CartReadDto(event.cartId, event.cartCurrency),
        );
      }
      if (event instanceof ProductAddedEvent) {
        const cartProducts = await this.productsRepo.getForCartId(cartId);
        const texts = (await this.queryBus.execute(
          new ProductDataQuery(event.productId),
        )) as Maybe<ProductDataDto>;
        if (!texts) {
          this.logger.error(
            `Cannot find ProductDataDto for product ${event.productId}`,
          );
        }

        await this.productsRepo.store(
          cartProducts.withAddedProduct(
            new ProductReadDto(
              event.productId,
              texts?.name || 'Unknown product name',
              event.productPrice,
              event.quantity,
              texts?.description,
            ),
          ),
        );
      }

      if (event instanceof ProductRemovedEvent) {
        const cartProducts = await this.productsRepo.getForCartId(cartId);
        const existing = cartProducts.getProduct(event.productId);
        if (existing) {
          const left = existing.quantity - event.removedQuantity;
          if (left <= 0) {
            await this.productsRepo.store(
              cartProducts.withRemovedProduct(event.productId),
            );
          } else {
            await this.productsRepo.store(
              cartProducts.withChangedProduct(
                new ProductReadDto(
                  existing.id,
                  existing.name,
                  existing.price,
                  left,
                  existing.description,
                ),
              ),
            );
          }
        }
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

      if (event instanceof CartCheckedOutEvent) {
        const cart = await this.repo.getById(event.cartId);
        if (cart) {
          await this.repo.delete(cart);
        }
        const products = await this.productsRepo.getForCartId(event.cartId);
        if (products) {
          await this.productsRepo.delete(products);
        }
      }

      if (event instanceof CartCurrencyChangedEvent) {
        const cart = await this.repo.getById(event.cartId);
        if (cart) {
          cart.currency = event.newCurrency;
          this.repo.store(cart);
        }

        const promises: Promise<
          ProductReadDto
        >[] = event.recalculatedCartProducts.map(
          async (cartProduct): Promise<ProductReadDto> => {
            const texts = (await this.queryBus.execute(
              new ProductDataQuery(cartProduct.productId),
            )) as Maybe<ProductDataDto>;
            if (!texts) {
              this.logger.error(
                `Cannot find ProductDataDto for product ${cartProduct.productId}`,
              );
            }
            return new ProductReadDto(
              cartProduct.productId,
              texts?.name || 'Unknown product name',
              cartProduct.price.toObject(),
              cartProduct.quantity,
              texts?.description,
            );
          },
        );

        const productReadDtos = await Promise.all(promises);

        await this.productsRepo.store(
          new CartProductsReadDto(event.cartId, productReadDtos),
        );
      }

      this.eventBus.publish(new CartReadModelUpdatedEvent(cartId));
    }
  }
}
