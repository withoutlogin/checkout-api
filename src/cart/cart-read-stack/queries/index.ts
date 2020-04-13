import { IQuery } from '@nestjs/cqrs';

export class CartByIdQuery implements IQuery {
  constructor(public readonly cartId: string) {}
}
