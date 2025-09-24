import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    // get message from @SetMetadata
    const customMessage =
      this.reflector.get<string>('custom:message', context.getHandler()) ?? '';

    return next.handle().pipe(
      map((data) => {
        return {
          success: true,
          message: customMessage || 'Request successful',
          data: data ?? null,
        };
      }),
    );
  }
}
