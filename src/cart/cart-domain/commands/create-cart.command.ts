import { Currency } from 'pricing/money';

export class CreateCartCommand {
  constructor(public readonly id: string, public readonly currency: Currency) {}
}
