import {
  Injectable,
  ExecutionContext,
  CallHandler,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Logger } from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { ResourceCreatedInCollection } from './response';
import { ServerResponse } from 'http';

function isExpressRequest(request: Request): request is Request {
  return request.app !== undefined;
}

function isServerResponse(response: any): response is ServerResponse {
  return response.setHeader !== undefined;
}

@Injectable()
export class CreatedLocationInterceptor implements NestInterceptor {
  logger = new Logger(CreatedLocationInterceptor.name);
  constructor(private readonly reflector: Reflector) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    if (!isExpressRequest(request) || !isServerResponse(response)) {
      this.logger.error('Interceptor can work with Express library only.');
      return next.handle();
    }

    if (request.method === 'POST') {
      return next.handle().pipe(
        tap((arg) => {
          const path = request.path;
          if (
            response.statusCode === 201 &&
            arg instanceof ResourceCreatedInCollection
          ) {
            const resourceUrl = `${path}/${arg.resourceId}`;
            response.setHeader('Location', resourceUrl);
          }
        }),
      );
    }

    return next.handle();
  }
}
