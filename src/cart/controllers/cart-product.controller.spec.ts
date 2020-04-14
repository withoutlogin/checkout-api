import { Test, TestingModule } from '@nestjs/testing';
import { CartProductController } from './cart-product.controller';
import { CqrsModule } from '@nestjs/cqrs';

describe('CartProduct Controller', () => {
  // todo controller test
  let controller: CartProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CartProductController],
    }).compile();

    controller = module.get<CartProductController>(CartProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
