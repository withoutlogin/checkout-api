import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CheckoutController } from './checkout.controller';

describe('Checkout Controller', () => {
  // todo tests for controller
  let controller: CheckoutController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CheckoutController],
    }).compile();

    controller = module.get<CheckoutController>(CheckoutController);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(queryBus).toBeDefined();
  });
});
