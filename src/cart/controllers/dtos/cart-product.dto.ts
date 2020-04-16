import { ApiProperty } from '@nestjs/swagger';

export class CartProductInputDto {
  @ApiProperty({ example: 'cdb63720-9628-5ef6-bbca-2e5ce6094f3c' })
  id!: string;
  @ApiProperty({ example: 5, exclusiveMinimum: true, minimum: 0 })
  quantity!: number;
}
