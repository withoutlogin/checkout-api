import { initialCartStateEvents } from './initial-carts-state';
import { OnModuleInit, Injectable } from '@nestjs/common';
import { EventBus } from '@nestjs/cqrs';

@Injectable()
export class InitAppStateService implements OnModuleInit {
  constructor(private bus: EventBus) {}
  onModuleInit() {
    this.bus.publishAll(initialCartStateEvents);
  }
}
