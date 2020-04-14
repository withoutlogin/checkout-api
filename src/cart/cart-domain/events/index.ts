import { CartCurrencyChangedEvent } from './cart-currency-changed-event';
import { CartCurrencyConversionRateChangedEvent } from './cart-currency-conversion-rate-changed-event';
import { ProductAddedEvent } from './product-added-event';
import { ProductPriceUpdatedEvent } from './product-price-updated-event';
import { ProductQuantityUpdatedEvent } from './product-quantity-updated-event';
import { ProductRemovedEvent } from './product-removed-event';

export const domainEvents = [
  CartCurrencyChangedEvent,
  CartCurrencyConversionRateChangedEvent,
  ProductAddedEvent,
  ProductPriceUpdatedEvent,
  ProductQuantityUpdatedEvent,
  ProductRemovedEvent,
];
