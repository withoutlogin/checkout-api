import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartFinderService } from './cart-read-stack/cart-finder/cart-finder.service';
import { Cart } from './cart-domain/cart';
import {
  CartReadDto,
  CartProductReadDto,
  PriceDto,
} from './cart-read-stack/cart-read-dtos';
import { Maybe } from 'common/ts-helpers';
import { v4 as uuidv4 } from 'uuid';
import { Currency } from '../pricing/money';
import Dinero from 'dinero.js';
import { CqrsModule } from '@nestjs/cqrs';

const createPriceDto = (currency: Currency, amountInPrecision2: number) => {
  return PriceDto.from(
    Dinero({ currency: currency, precision: 2, amount: amountInPrecision2 }),
  );
};

class CartFinderServiceMock extends CartFinderService {
  async getCart(cartId: string): Promise<Maybe<CartReadDto>> {
    return new CartReadDto(cartId, 'PLN');
  }

  async getProductsFor(cartId: string): Promise<CartProductReadDto[]> {
    const cart = await this.getCart(cartId);
    if (!cart) {
      return [];
    }
    return [
      new CartProductReadDto(uuidv4(), 'Abc', createPriceDto('PLN', 1500), 3),
    ];
  }
}
describe('Cart Controller', () => {
  let controller: CartController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CqrsModule],
      controllers: [CartController],
      providers: [
        {
          provide: CartFinderService,
          useClass: CartFinderServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
