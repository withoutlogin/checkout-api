import { ApiProperty } from '@nestjs/swagger';

export class CartProductUpdateInputDto {
  @ApiProperty({ minimum: 0, exclusiveMinimum: true, example: 8 })
  quantity!: number;
}
