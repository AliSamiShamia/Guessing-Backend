import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof HttpException) {
          return {
            status_code: data.getStatus(),
            message: data.getResponse(),
          };
        } else {
          return {
            status_code: HttpStatus.OK,
            data,
          };
        }
      }),
    );
  }
}
