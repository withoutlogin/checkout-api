import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { commands } from './commands';
import { commandHandlers } from './handlers';
import { CartDomainRepository } from './repositories';

@Module({
  imports: [CqrsModule],
  providers: [...commands, ...commandHandlers, CartDomainRepository],
})
export class CartDomainModule {}
