import { IsInt, IsOptional, IsPositive, ValidateIf } from 'class-validator';
import { ERROR_CODES } from '../../consts';
import { getNotPositiveOption, getWrongTypeOption } from '../../common/utils/utils';
import {isNil} from 'lodash';
import { IsPositiveInt } from '../../common/validators/positive-int.validator';

export class GetTransactionsDto {
  @ValidateIf(data => data && (data.size !== '' && !isNil(data.size)))
  @IsPositiveInt()
  readonly size: string;

  @ValidateIf(data => data && (data.size !== '' && !isNil(data.size)))
  @IsPositiveInt()
  readonly page: string;
}
