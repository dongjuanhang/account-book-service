import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ResWrapper } from '../dto/response';
import { get } from 'lodash';
import { ERROR_CODES } from '../../consts';

@Catch()
export class ExceptionWrapper implements ExceptionFilter {
  public catch(exception: any, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : get(exception, 'statusCode', HttpStatus.INTERNAL_SERVER_ERROR);
    const res = this.getRes(exception);
    response
      .status(status)
      .json(res);

  }

  private getRes(exception: any) {
    const errorInfo = get(exception, 'message') || get(exception, 'error');
    if (get(exception, 'message') instanceof ResWrapper) {
      return errorInfo;
    } else {
      const message = this.getMessage(errorInfo);
      const errorCode = get(errorInfo, 'errorCode', ERROR_CODES.UNRECOGNIZE);
      const success = false;
      const data = get(errorInfo, 'data', {});
      return new ResWrapper(errorCode, message, data, success);
    }
  }

  getMessage(message: object | string | undefined) {
    if (typeof message === 'string') {
      return message;
    } else if (typeof message === 'object') {
      return get(message, 'message') || get(message, 'error');
    } else {
      return '未知错误';
    }
  }
}
