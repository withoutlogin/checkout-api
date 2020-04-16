import { Module, INestApplication } from '@nestjs/common';
import { AppService } from './app.service';
import { CartModule } from './cart/cart.module';
import { PricingModule } from './pricing/pricing.module';
import { CommonRestModule } from 'common/rest/common-rest.module';
import { InitAppStateService } from 'cart/fixtures/init-app-state.service';
import { CqrsModule } from '@nestjs/cqrs';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

@Module({
  imports: [CqrsModule, CommonRestModule, CartModule, PricingModule],
  providers: [AppService, InitAppStateService],
})
export class AppModule {
  static registerSwagger(app: INestApplication) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle('Cart API')
      .setDescription('REST API for e-commerce cart feature.')
      .setVersion('1.0.0')
      .build();
    const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
    SwaggerModule.setup('', app, swaggerDocument);
  }
}
