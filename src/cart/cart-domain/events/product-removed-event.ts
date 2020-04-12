export class ProductRemovedEvent {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
  ) {}
}
