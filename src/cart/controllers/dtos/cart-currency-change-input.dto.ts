import { Currency } from 'pricing/money';
import { ApiProperty } from '@nestjs/swagger';

export class CartCurrencyChangeInputDto {
  @ApiProperty({
    type: String,
    example: 'EUR',
    description: 'Currency in ISO 4217 format.',
  })
  currency!: Currency;
}
