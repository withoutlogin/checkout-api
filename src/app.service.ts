import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {
    console.log('app service init');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
