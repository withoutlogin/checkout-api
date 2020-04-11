export class AddProductCommand {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
    public readonly quantity: number,
  ) {}
}
