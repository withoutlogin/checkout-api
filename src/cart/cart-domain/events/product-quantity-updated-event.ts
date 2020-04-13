export class ProductQuantityUpdatedEvent {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
    public readonly newQuantity: number,
  ) {}
}