import { Injectable } from '@nestjs/common';
import { getInitialProductData } from 'pricing/fixtures/initial-product-pricing-and-texts';
import { ProductDataDto } from './dto/product-data.dto';

@Injectable()
export class ProductsDataRepository {
  async getProducts(): Promise<ProductDataDto[]> {
    return getInitialProductData();
  }
}
