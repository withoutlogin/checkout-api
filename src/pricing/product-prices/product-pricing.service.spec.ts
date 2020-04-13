import { Test, TestingModule } from '@nestjs/testing';
import { ProductPricingService } from './product-pricing.service';

describe('PricingService', () => {
  let service: ProductPricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductPricingService],
    }).compile();

    service = module.get<ProductPricingService>(ProductPricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
