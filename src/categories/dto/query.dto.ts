import { IsNumberString, IsString, IsOptional, Length, IsIn } from 'class-validator';
import { getWrongTypeOption } from '../../common/utils/utils';

export enum CATEGORIES_TYPE {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class QueryDto {
  @IsOptional()
  @IsString(getWrongTypeOption('字符串'))
  @Length(1, 6, { message: '分类长度只能在1到6之间' })
  readonly name: string;

  @IsOptional()
  @IsString(getWrongTypeOption('字符串'))
  @IsIn([CATEGORIES_TYPE.INCOME, CATEGORIES_TYPE.EXPENSE], { message: `$property只能传入${CATEGORIES_TYPE.INCOME}/${CATEGORIES_TYPE.EXPENSE}` })
  readonly type: string;

  @IsOptional()
  @IsNumberString(getWrongTypeOption('数值'))
  readonly code: string;

}
