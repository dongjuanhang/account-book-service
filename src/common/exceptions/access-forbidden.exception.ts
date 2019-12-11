import { HttpException, HttpStatus } from '@nestjs/common';
import {IResponse} from '../interfaces/response.interface';

export class AccessForbidden extends HttpException {
  constructor(options: IResponse<any>, status = HttpStatus.FORBIDDEN) {
    super(options, status);
  }
}
