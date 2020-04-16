import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ProductDataQuery } from './product-data.query';
import { ProductsDataRepository } from './product-data.repository';
import { ProductDataDto } from './dto/product-data.dto';
import { Maybe } from 'common/ts-helpers';

@QueryHandler(ProductDataQuery)
export class ProductDataQueryHandler
  implements IQueryHandler<ProductDataQuery> {
  constructor(private repo: ProductsDataRepository) {}

  async execute(query: ProductDataQuery): Promise<Maybe<ProductDataDto>> {
    const products = await this.repo.getProducts();
    return products.find((p) => p.id === query.productId);
  }
}
