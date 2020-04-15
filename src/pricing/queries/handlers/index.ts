import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetPriceForProductQuery } from '..';
import { ProductPricingService } from 'pricing/product-prices/product-pricing.service';
import { Maybe } from 'common/ts-helpers';
import { ProductPrice } from 'pricing/product-prices/product-price';

@QueryHandler(GetPriceForProductQuery)
export class GetPriceForProductQueryHandler
  implements IQueryHandler<GetPriceForProductQuery> {
  constructor(private pricingService: ProductPricingService) {}

  async execute(query: GetPriceForProductQuery): Promise<Maybe<ProductPrice>> {
    return this.pricingService.getPriceInCurrency(
      query.productId,
      query.currency,
    );
  }
}
