export class RemoveProductCommand {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
  ) {}
}
