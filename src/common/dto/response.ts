import { ERROR_CODES } from '../../consts';

export class ResWrapper<T> {
  constructor(
    readonly errorCode: ERROR_CODES,
    readonly message: string,
    readonly data: T,
    readonly success: boolean = false,
  ) {}
}
