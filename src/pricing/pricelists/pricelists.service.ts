import { Injectable } from '@nestjs/common';
import { Currency } from 'dinero.js';

@Injectable()
export class PriceListsService {
  async getSupportedCurrencies(): Promise<Currency[]> {
    return ['AED', 'CAD', 'EUR', 'FJD', 'GBP', 'JPY', 'PLN', 'USD'];
  }
}
