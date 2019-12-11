import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { toNumber } from 'lodash';

export function IsPositiveInt(validationOptions?: ValidationOptions) {
  return (object: object, property: string) => {
    registerDecorator({
      name: 'isPositiveInt',
      target: object.constructor,
      propertyName: property,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(val: string, args: ValidationArguments) {
          return toNumber(val) > 0 && (toNumber(val) % 1 === 0);
        },
        defaultMessage(validationArguments?: ValidationArguments): string {
          return '$property必须是正整数';
        },
      },
    });
  };
}
