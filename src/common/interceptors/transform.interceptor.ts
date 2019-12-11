import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IResponse } from '../interfaces/response.interface';
import { ResWrapper } from '../dto/response';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResWrapper<T>> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResWrapper<T>> | Promise<Observable<ResWrapper<T>>> {
    return next
      .handle()
      .pipe(map((data: any) => {
        const { message, errorCode, ...result } = data;
        return new ResWrapper(
          errorCode || 0,
           message || '请求成功',
          result,
          !errorCode,
        );
      }));
  }
}
