import { CqrsModule, QueryBus, ofType } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Maybe } from 'common/ts-helpers';
import { v4 as uuidv4 } from 'uuid';
import { CartFinderService } from '../cart-read-stack/cart-finder.service';
import { CartController } from './cart.controller';
import { CartByIdQuery } from '../cart-read-stack/queries/cart-by-id.query';

describe('Cart Controller', () => {
  // todo tests for controller
  let controller: CartController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CartController],
    }).compile();

    controller = module.get<CartController>(CartController);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(queryBus).toBeDefined();
  });

  // it('should execute CartByIdQuery', async (done) => {
  //   // having
  //   const someCartId = uuidv4();
  //   queryBus.execute = jest.fn().mockReturnValue(Promise.resolve());

  //   // expect
  //   expect(queryBus.execute).toBeCalledWith(new CartByIdQuery(someCartId));

  //   // when
  //   controller.getCart(someCartId);
  // });
});
