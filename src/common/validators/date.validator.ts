import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { toString } from 'lodash';

export function CheckDate(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        async validate(text: string, args: ValidationArguments) {
          return /\d{4}\/\d{2}\/\d{2}/.test(toString(text));
        },
      },
    });
  };
}
