import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, any>
{

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<any> {

    return next.handle().pipe(

      map((data) => {

        if (data?.message || data?.data) {
          return {
            success: true,
            message: data.message || 'Success',
            data: data.data ?? data,
          };
        }

        return {
          success: true,
          message: 'Success',
          data,
        };

      }),

    );

  }

}