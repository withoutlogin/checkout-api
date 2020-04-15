import { Controller, Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ProductDataDto } from './dto/product-data.dto';
import { getInitialProductData } from 'pricing/fixtures/initial-product-pricing-and-texts';

@Controller('products')
export class ProductsController {
  @Get()
  @ApiResponse({ type: [ProductDataDto] })
  async getProducts(): Promise<ProductDataDto[]> {
    return getInitialProductData();
  }
}
