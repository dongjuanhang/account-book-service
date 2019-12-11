import { BadRequestException, HttpStatus } from '@nestjs/common';
import {IResponse} from '../interfaces/response.interface';

export class ParamsError extends BadRequestException {
  constructor(options: IResponse<any>, status = HttpStatus.BAD_REQUEST) {
    super(options, status as any);
  }
}
