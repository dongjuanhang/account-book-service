import { ERROR_CODES } from '../../consts';

export function getNotEmptyOption() {
  return {
    message: '$property字段不能为空',
    context: {
      errorCode: ERROR_CODES.PARAM_MISSING,
    },
  };
}

export function getWrongTypeOption(type: string) {
  return {
    message: '$property必须为' + type + '类型',
    context: {
      errorCode: ERROR_CODES.PARAM_TYPE_ERROR,
    },
  };
}

export function getNotPositiveOption() {
  return {
    message: '$property不应小于0',
    context: {
      errorCode: ERROR_CODES.PARAM_RANGE_ERROR,
    },
  };
}
