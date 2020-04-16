import { ApiProperty } from '@nestjs/swagger';

export class ResourceCreatedInCollection {
  @ApiProperty({
    type: String,
    example: '2680ee73-8661-4248-a1a0-b77799fc8cb4',
  })
  resourceId: string | undefined;

  constructor(resourceId: string) {
    this.resourceId = resourceId;
  }
}

export class CreatedLocationDto {
  constructor(public readonly location: string) {}
}
