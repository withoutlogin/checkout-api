import { ApiProperty } from '@nestjs/swagger';

export class ProductDataDto {
  @ApiProperty({ example: '2680ee73-8661-4248-a1a0-b77799fc8cb4' })
  id!: string;

  @ApiProperty({ example: 'Funny hat' })
  name!: string;

  @ApiProperty({ example: 'A description of funny hat.' })
  description?: string;
}
