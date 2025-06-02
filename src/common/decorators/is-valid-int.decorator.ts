import type { ValidationOptions } from 'class-validator';
import { registerDecorator } from 'class-validator';

import { validIntValidator } from './utils/valid-int.util';

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
