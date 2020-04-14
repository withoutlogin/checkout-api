import { DynamicModule } from '@nestjs/common';
import { CartDomainTypes } from './cart-domain.types';
import { commandHandlers } from './handlers';
import { IPricingRepository } from './repositories';
import { ICartRepository } from './repositories/index';
import { commands } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCartHandler } from './handlers/create-cart.handler';
import { CartWriteStackModule } from 'cart/cart-write-stack/cart-write-stack.module';
import { CartReadStackModule } from 'cart/cart-read-stack/cart-read-stack.module';
import { PricingModule } from 'pricing/pricing.module';

interface CartDomainInfrastructure {
  pricingRepository: IPricingRepository;
  cartRepository: ICartRepository;
}

export class CartDomainModule {
  // todo: initialize this module properly in outer module
  static register(infrastructure: CartDomainInfrastructure): DynamicModule {
    return {
      imports: [
        CqrsModule,
        CartWriteStackModule,
        CartReadStackModule,
        PricingModule,
      ],
      module: CartDomainModule,
      exports: [CreateCartHandler],
      providers: [
        {
          provide: CartDomainTypes.CART_REPOSITORY,
          useValue: infrastructure.cartRepository,
        },
        {
          provide: CartDomainTypes.PRICING_REPOSITORY,
          useValue: infrastructure.pricingRepository,
        },
        ...commands,
        ...commandHandlers,
      ],
    };
  }
}
