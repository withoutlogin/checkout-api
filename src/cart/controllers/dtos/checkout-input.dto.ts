import { ApiProperty } from '@nestjs/swagger';

export class CheckoutInputDto {
  @ApiProperty({ example: 'eb261ef2-da87-41c3-8005-dad1cf2d7438' })
  cartId!: string;
}
