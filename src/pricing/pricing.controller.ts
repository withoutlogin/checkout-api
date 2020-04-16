import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ProductPrice, ProductPriceDto } from './product-prices/product-price';
import { ProductPricingService } from './product-prices/product-pricing.service';
import { PriceListsService } from './pricelists/pricelists.service';
import { Currency } from './money';
import { ApiResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('pricing')
export class PricingController {
  constructor(
    private priceListsService: PriceListsService,
    private pricingService: ProductPricingService,
  ) {}

  @Get('/pricelists')
  @ApiOperation({
    description: 'Return list of possible currencies to use in Cart API.',
  })
  async getPriceLists(): Promise<{ currency: Currency }[]> {
    const supportedCurrencies = await this.priceListsService.getSupportedCurrencies();
    return supportedCurrencies.map((currency) => ({ currency }));
  }

  @Get('/pricelists/:currency/products')
  @ApiOperation({
    description:
      'Returns list of products with their prices in given currency.',
  })
  @ApiResponse({ status: 200, type: [ProductPriceDto] })
  @ApiParam({ name: 'currency', example: 'GBP' })
  async getPriceForAllProducts(
    @Param('currency') currency: string,
  ): Promise<ProductPrice[]> {
    const supportedCurrencies = await this.priceListsService.getSupportedCurrencies();
    if (supportedCurrencies.includes(currency as Currency)) {
      const prices = await this.pricingService.getPriceList(
        currency as Currency,
      );
      return Array.from(prices.values());
    }
    // throw new NotFoundException();
    return [];
  }

  @Get('pricelists/:currency/products/:productId')
  @ApiOperation({
    description: 'Return price of a single product in the offer.',
  })
  @ApiParam({ name: 'currency', example: 'GBP' })
  @ApiParam({
    name: 'productId',
    example: '2680ee73-8661-4248-a1a0-b77799fc8cb4',
  })
  async getPriceForProduct(
    @Param('currency') currency: string,
    @Param('productId') productId: string,
  ): Promise<ProductPriceDto> {
    const supportedCurrencies = await this.priceListsService.getSupportedCurrencies();
    if (supportedCurrencies.includes(currency as Currency)) {
      const price = await this.pricingService.getPriceInCurrency(
        productId,
        currency as Currency,
      );
      if (price) {
        return price.toDto();
      }
    }
    throw new NotFoundException();
  }
}
