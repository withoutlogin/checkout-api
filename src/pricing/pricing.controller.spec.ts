import { Test, TestingModule } from '@nestjs/testing';
import { PricingController } from './pricing.controller';
import { PriceListsService } from './pricelists/pricelists.service';
import { Currency } from './money';
import { ProductPricingService } from './product-prices/product-pricing.service';

class PriceListServiceMock extends PriceListsService {
  async getSupportedCurrencies(): Promise<Currency[]> {
    return ['EUR', 'PLN', 'USD'];
  }
}

class ProductPricingServiceMock extends ProductPricingService {
  constructor() {
    super();
  }
}

describe('Pricing Controller', () => {
  let controller: PricingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PricingController],
      providers: [
        {
          provide: PriceListsService,
          useClass: PriceListServiceMock,
        },
        {
          provide: ProductPricingService,
          useClass: ProductPricingServiceMock,
        },
      ],
    }).compile();

    controller = module.get<PricingController>(PricingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
