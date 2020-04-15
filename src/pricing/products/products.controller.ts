import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ProductDataDto } from './dto/product-data.dto';
import { ProductsDataRepository } from './product-data.repository';

@Controller('products')
export class ProductsController {
  constructor(private repo: ProductsDataRepository) {}

  @Get()
  @ApiResponse({ type: [ProductDataDto] })
  async getProducts(): Promise<ProductDataDto[]> {
    return this.repo.getProducts();
  }
}
