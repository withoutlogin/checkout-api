import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { CartDomainModule } from './cart/cart-domain/cart-domain.module';

@Module({
  imports: [CartDomainModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
