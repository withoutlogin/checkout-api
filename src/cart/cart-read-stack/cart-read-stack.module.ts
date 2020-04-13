import { Module } from '@nestjs/common';
import { CartFinderService } from './cart-finder/cart-finder.service';

@Module({
  providers: [CartFinderService],
})
export class CartReadStackModule {}
