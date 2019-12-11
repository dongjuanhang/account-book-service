import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { getNotEmptyOption, getNotPositiveOption, getWrongTypeOption } from '../../common/utils/utils';
import { CheckDate } from '../../common/validators/date.validator';
import { IsPositiveInt } from '../../common/validators/positive-int.validator';

export class CreateOrAmendTransactionDto {
  @IsNotEmpty(getNotEmptyOption())
  @IsPositiveInt()
  readonly categoryCode: number;

  @IsNotEmpty(getNotEmptyOption())
  @IsNumber({
      allowNaN: false,
      allowInfinity: false,
      maxDecimalPlaces: 2,
    },
    getWrongTypeOption('最多两位小数的数值'),
  )
  @IsPositive(getNotPositiveOption())
  readonly amount: number;

  @IsOptional()
  @IsString(getWrongTypeOption('字符'))
  readonly remark: string;

  @IsNotEmpty(getNotEmptyOption())
  @CheckDate({ message: '$property必须是YYYY/MM/DD格式' })
  readonly date: string;
}
