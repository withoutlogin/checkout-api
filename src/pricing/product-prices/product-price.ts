import { Money } from '../money';
import { IMoneyDataDto } from '../../cart/cart-read-stack/dto/cart-products.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IMoneyData } from 'cart/cart-domain/valueobjects';

export class ProductPriceDto {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  price: IMoneyDataDto;

  constructor(productId: string, price: IMoneyData) {
    this.productId = productId;
    this.price = price;
  }
}

export class ProductPrice {
  constructor(
    public readonly productId: string,
    public readonly price: Money,
  ) {}

  toDto(): ProductPriceDto {
    return new ProductPriceDto(this.productId, this.price.toObject());
  }
}
