import { InvalidQuantityError } from '../errors';

export class ChangeProductQuantityCommand {
  constructor(
    public readonly cartId: string,
    public readonly productId: string,
    public readonly newQuantity: number,
  ) {
    if (newQuantity <= 0) {
      throw new InvalidQuantityError('Quantity cannot be 0 or negative');
    }
  }
}
