import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { CartModule } from 'cart/cart.module';

describe('CartsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CartModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/carts (POST)', (done) => {
    const server = app.getHttpServer();
    request(server)
      .post('/carts')
      .expect((res) => {
        if (!res.header?.location) {
          throw new Error('Location header expected');
        }

        request(server).get(res.header.location).expect(200).end(done);
      })
      .end(() => {
        return;
      });
  });
});
