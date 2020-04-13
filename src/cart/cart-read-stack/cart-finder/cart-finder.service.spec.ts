import { Test, TestingModule } from '@nestjs/testing';
import { CartFinderService } from './cart-finder.service';

describe('CartFinderService', () => {
  let service: CartFinderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartFinderService],
    }).compile();

    service = module.get<CartFinderService>(CartFinderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
