import { Test, TestingModule } from '@nestjs/testing';
import { PriceListsService } from './pricelists.service';

describe('PriceListsService', () => {
  let service: PriceListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PriceListsService],
    }).compile();

    service = module.get<PriceListsService>(PriceListsService);
  });

  it('should return not empty list of supported currencies', async () => {
    expect(await service.getSupportedCurrencies()).not.toHaveLength(0);
  });
});
