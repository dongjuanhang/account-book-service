import { IsBoolean, IsString, Length, IsNotEmpty } from 'class-validator';
import { getWrongTypeOption, getNotEmptyOption } from '../../common/utils/utils';

export class CreateOrAmendCategoryDto {

  @Length(1, 6, { message: '分类名称长度只能在1到6之间' })
  @IsString(getWrongTypeOption('字符串'))
  @IsNotEmpty(getNotEmptyOption())
  readonly categoryName: string;

  @IsBoolean(getWrongTypeOption('boolean'))
  @IsNotEmpty(getNotEmptyOption())
  readonly isExpense: boolean;
}
