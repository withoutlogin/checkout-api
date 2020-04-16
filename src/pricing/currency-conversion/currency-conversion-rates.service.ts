import { Injectable } from '@nestjs/common';
import { Currency } from '../money';
import axios from 'axios';
type ConversionRatesValuesMap = {
  [key in Currency]: number;
};
interface ConversionRates {
  rates: ConversionRatesValuesMap;
  base: Currency;
  date: Date;
}

@Injectable()
export class CurrencyConversionRatesService {
  async getConversionRatesFor(currency: Currency): Promise<ConversionRates> {
    const response = await axios.get('https://api.exchangeratesapi.io/latest', {
      params: {
        base: currency,
      },
    });
    const { data } = response;
    return {
      rates: data.rates,
      base: data.base as Currency,
      date: new Date(data.date),
    };
  }
}
