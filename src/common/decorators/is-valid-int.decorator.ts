import { validIntValidator } from '@utils/valid-int.util';
import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

export function IsValidInt(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidInt',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: validIntValidator,
    });
  };
}
