import { DynamicModule } from '@nestjs/common';
import { CartDomainTypes } from './cart-domain.types';
import { AddProductCommand } from './commands/add-product-command';
import { ChangeProductQuantityCommand } from './commands/change-product-quantity-command';
import { RemoveProductCommand } from './commands/remove-product-command';
import { AddProductHandler } from './handlers/add-product-handler';
import { ChangeProductQuantityHandler } from './handlers/change-product-quantity-handler';
import { RemoveProductHandler } from './handlers/remove-product-handler';
import { IPricingRepository } from './repositories';
import { ICartRepository } from './repositories/index';

const commands = [
  AddProductCommand,
  RemoveProductCommand,
  ChangeProductQuantityCommand,
];

const handlers = [
  AddProductHandler,
  RemoveProductHandler,
  ChangeProductQuantityHandler,
];

interface CartDomainInfrastructure {
  pricingRepository: IPricingRepository;
  cartRepository: ICartRepository;
}

export class CartDomainModule {
  register(infrastructure: CartDomainInfrastructure): DynamicModule {
    return {
      module: CartDomainModule,
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
        ...handlers,
      ],
    };
  }
}
